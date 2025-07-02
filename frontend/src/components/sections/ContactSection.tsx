'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSubmitContact } from '@/hooks/api';
import { Button, Input, Textarea, LoadingSpinner } from '@/components/ui';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitContact = useSubmitContact();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await submitContact.mutateAsync(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
              <p className="text-gray-300 mb-6">
                Obrigado pelo contato! Responderei em breve.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
              >
                Enviar Nova Mensagem
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
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
            <span className="gradient-text">Vamos Conversar</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tem um projeto em mente? Entre em contato e vamos criar algo incrível juntos!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 text-gray-300"
                >
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm">rafaelcrb@hotmail.com.br</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 text-gray-300"
                >
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm">+55 (11) 99999-9999</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 text-gray-300"
                >
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-sm">São Paulo, Brasil</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Disponibilidade</h4>
              <p className="text-gray-300 text-sm">
                Estou sempre aberto a discutir novos projetos e oportunidades. 
                Respondo normalmente em até 24 horas.
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />

                <Textarea
                  label="Mensagem"
                  placeholder="Conte-me sobre seu projeto ou como posso ajudá-lo..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={errors.message}
                  rows={5}
                  required
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={18} />
                      Enviar Mensagem
                    </div>
                  )}
                </Button>

                {submitContact.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    Erro ao enviar mensagem. Tente novamente.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

