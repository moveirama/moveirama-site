'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Já está logado, redireciona para o admin
        router.push('/admin/imagens')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoggingIn(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos')
        } else {
          setError(error.message)
        }
        setLoggingIn(false)
        return
      }

      if (data.user) {
        router.push('/admin/imagens')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      setLoggingIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <div className="text-[#8B7355]">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">Admin Moveirama</h1>
          <p className="text-[#8B7355] mt-2">Faça login para continuar</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E8DFD5] p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] focus:border-transparent text-[#2D2D2D] placeholder-[#B8A99A]"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] focus:border-transparent text-[#2D2D2D] placeholder-[#B8A99A]"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-[#6B8E7A] text-white font-medium rounded-lg hover:bg-[#5A7A68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <p className="text-center text-sm text-[#8B7355] mt-6">
          Acesso restrito à equipe Moveirama
        </p>
      </div>
    </div>
  )
}
