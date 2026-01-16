'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function AdminImagensPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center">
        <p className="text-[var(--color-toffee)]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-sand-light)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-graphite)]">
            Admin Moveirama
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-toffee)]">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--color-sage-600)] hover:text-[var(--color-sage-700)] font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-6">
          Gestão de Imagens
        </h2>
        
        <div className="bg-white rounded-lg border border-[var(--color-sand-light)] p-8 text-center">
          <p className="text-[var(--color-toffee)]">
            ✅ Login funcionando! Próximo passo: listagem de produtos.
          </p>
        </div>
      </main>
    </div>
  )
}
