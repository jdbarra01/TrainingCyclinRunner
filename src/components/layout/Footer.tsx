import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-8 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Hecho para ciclistas que entrenan con inteligencia.</p>
        <p className="mt-1">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Inicio</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/athlete" className="hover:text-blue-600 dark:hover:text-blue-400">Deportista</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/objectives" className="hover:text-blue-600 dark:hover:text-blue-400">Objetivos</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/training" className="hover:text-blue-600 dark:hover:text-blue-400">Entrenos</Link>
        </p>
      </div>
    </footer>
  )
}
