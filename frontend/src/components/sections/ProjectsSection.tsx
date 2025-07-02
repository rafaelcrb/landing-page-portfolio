'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useProjects } from '@/hooks/api';
import { Card, LoadingSpinner } from '@/components/ui';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { Project } from '@/types';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="group cursor-pointer" hover>
      <div className="space-y-4">
        {/* Project image */}
        {project.image && (
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onViewDetails(project)}
                className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
              >
                <Eye size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Project info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            {project.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                Destaque
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{project.tags.length - 3} mais
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {project.link && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
                Ver Projeto
              </motion.a>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewDetails(project)}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <Eye size={14} />
              Detalhes
            </motion.button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Get unique tags
  const allTags = projects?.flatMap(project => project.tags) || [];
  const uniqueTags = ['all', ...Array.from(new Set(allTags))];

  // Filter projects by selected tag
  const filteredProjects = projects?.filter(project => 
    selectedTag === 'all' || project.tags.includes(selectedTag)
  ) || [];

  // Sort projects (featured first, then by date)
  const sortedProjects = filteredProjects.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center text-red-400">
            Erro ao carregar projetos. Tente novamente mais tarde.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Meus Projetos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes e projetos em destaque
          </p>
        </motion.div>

        {/* Filter tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {uniqueTags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tag === 'all' ? 'Todos' : tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProjectCard
                  project={project}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && sortedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 py-12"
          >
            <p>Nenhum projeto encontrado para o filtro selecionado.</p>
          </motion.div>
        )}
      </div>

      {/* Project details modal would go here */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {selectedProject.image && (
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <p className="text-gray-300 mb-4">{selectedProject.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600/20 text-blue-300 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {selectedProject.link && (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
                Ver Projeto
              </a>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}

