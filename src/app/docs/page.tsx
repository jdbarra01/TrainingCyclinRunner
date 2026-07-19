'use client'

import { useEffect, useRef } from 'react'

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js'
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwaggerUIBundle = (window as any).SwaggerUIBundle
      SwaggerUIBundle({
        url: '/api/docs/spec',
        dom_id: '#swagger-ui-container',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
      })
    }
    document.body.appendChild(script)

    return () => {
      link.remove()
      script.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 pb-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-white">
          Documentación de la API
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Endpoints REST del sistema TrainingCyclingRunner &mdash; prueba cada operación desde esta interfaz.
        </p>
        <div
          id="swagger-ui-container"
          ref={containerRef}
          className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        />
      </div>
    </div>
  )
}
