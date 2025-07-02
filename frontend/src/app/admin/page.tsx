'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/api';
import { useAuthStore } from '@/store';
import { Button, Input, LoadingSpinner } from '@/components/ui';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const login = useLogin();
  const { isAuthenticated, login: setAuth } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
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
      const response = await login.mutateAsync(formData);
      setAuth(response.token, response.user);
      router.push('/admin/dashboard');
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro ao fazer login' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-gray-300">Faça login para gerenciar seus projetos</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                className="pl-10"
              />
              <User className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3"
              >
                {errors.general}
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Voltar ao site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

