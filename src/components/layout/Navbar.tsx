'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'
import { useState } from 'react'
import { useAthlete } from '@/features/athlete/hooks/useAthlete'

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: '/', label: 'Inicio', icon: '📊' },
      { href: '/calendar', label: 'Calendario', icon: '📅' },
    ],
  },
  {
    label: 'Entrenamiento',
    items: [
      { href: '/objectives', label: 'Objetivos', icon: '🎯' },
      { href: '/training', label: 'Entrenos', icon: '🚴' },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/athlete', label: 'Perfil', icon: '👤' },
      { href: '/export', label: 'Exportar', icon: '📤' },
    ],
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [athleteMenuOpen, setAthleteMenuOpen] = useState(false)
  const { athlete, athletes, switchAthlete } = useAthlete()

  const initials = athlete?.name
    ? athlete.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">TC</span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className="flex items-center">
              {gi > 0 && <div className="mx-1.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />}
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {athletes.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setAthleteMenuOpen(!athleteMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {initials}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate">{athlete ? `${athlete.sport === 'running' ? '🏃' : '🚴'} ${athlete.name}` : 'Seleccionar'}</span>
                <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {athleteMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAthleteMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1.5 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="mb-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Cambiar deportista
                    </div>
                    {athletes.map(a => (
                      <button
                        key={a.id}
                        onClick={() => { switchAthlete(a.id); setAthleteMenuOpen(false) }}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          a.id === athlete?.id
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">
                          {a.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{a.sport === 'running' ? '🏃' : '🚴'} {a.name}</div>
                          <div className="text-[10px] text-zinc-400">{a.sport === 'running' ? `VO₂máx ${a.vo2max} · ${a.weight}kg` : `${a.ftp}W · ${a.weight}kg`}</div>
                        </div>
                        {a.id === athlete?.id && (
                          <svg className="h-4 w-4 shrink-0 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                    <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />
                    <Link
                      href="/athlete"
                      onClick={() => setAthleteMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">+</span>
                      Gestionar deportistas
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 pb-5 pt-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-3 last:mb-0">
              <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {group.label}
              </div>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
