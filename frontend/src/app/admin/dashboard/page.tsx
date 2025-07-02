'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminProjects, useDeleteProject } from '@/hooks/api';
import { useAuthStore } from '@/store';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, LogOut, Home } from 'lucide-react';
import { Project } from '@/types';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (project: Project) => void;
  onToggleFeatured: (project: Project) => void;
}

function AdminProjectCard({ 
  project, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  onToggleFeatured 
}: ProjectCardProps) {
  return (
    <Card className="group">
      <div className="space-y-4">
        {/* Project image */}
        {project.image && (
          <div className="relative h-32 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            {!project.isVisible && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Oculto</span>
              </div>
            )}
          </div>
        )}

        {/* Project info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            <div className="flex gap-1">
              {project.isFeatured && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
              {!project.isVisible && (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 2 && (
              <span className="text-gray-400 text-xs">
                +{project.tags.length - 2}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onEdit(project)}
              className="flex-1"
            >
              <Edit size={14} />
              Editar
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onToggleVisibility(project)}
            >
              {project.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onToggleFeatured(project)}
            >
              <Star size={14} className={project.isFeatured ? 'fill-current text-yellow-400' : ''} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(project.id)}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: projects, isLoading, error } = useAdminProjects();
  const deleteProject = useDeleteProject();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  const handleEdit = (project: Project) => {
    // TODO: Implement edit functionality
    console.log('Edit project:', project);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleToggleVisibility = (project: Project) => {
    // TODO: Implement toggle visibility
    console.log('Toggle visibility:', project);
  };

  const handleToggleFeatured = (project: Project) => {
    // TODO: Implement toggle featured
    console.log('Toggle featured:', project);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-300">Bem-vindo, {user?.name || user?.email}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                <Home size={16} />
                Ver Site
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {projects?.length || 0}
              </div>
              <div className="text-gray-300 text-sm">Total de Projetos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {projects?.filter(p => p.isVisible).length || 0}
              </div>
              <div className="text-gray-300 text-sm">Projetos Visíveis</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {projects?.filter(p => p.isFeatured).length || 0}
              </div>
              <div className="text-gray-300 text-sm">Projetos em Destaque</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {projects?.filter(p => !p.isVisible).length || 0}
              </div>
              <div className="text-gray-300 text-sm">Projetos Ocultos</div>
            </div>
          </Card>
        </div>

        {/* Projects section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Projetos</h2>
          <Button>
            <Plus size={16} />
            Novo Projeto
          </Button>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">
            Erro ao carregar projetos. Tente novamente mais tarde.
          </div>
        ) : projects && projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AdminProjectCard
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                  onToggleFeatured={handleToggleFeatured}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">Nenhum projeto encontrado</div>
            <Button>
              <Plus size={16} />
              Criar Primeiro Projeto
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

