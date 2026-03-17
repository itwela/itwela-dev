'use client'

import { useState, useRef, useEffect } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { DEFAULT_MODEL_LABEL } from '@/lib/agent'

type Message = { role: 'user' | 'assistant'; content: string }

export function AgentApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelUsed, setModelUsed] = useState<string>(DEFAULT_MODEL_LABEL)
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    if (!input.trim()) {
      el.style.height = '40px'
      return
    }
    el.style.height = '0px'
    const next = Math.min(140, Math.max(40, el.scrollHeight))
    el.style.height = `${next}px`
  }, [input])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error || res.statusText}. ${data.details || ''}` },
        ])
        return
      }

      if (data.model) setModelUsed(data.model)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content || '(No response)' }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Request failed: ${e instanceof Error ? e.message : 'Unknown error'}. Check OPENROUTER_API_KEY in .env.local.` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col text-gray-900 dark:text-white bg-[#f4f5f8] dark:bg-[#09090b]">
      {/* Header with model name */}
      <div className={`relative flex-shrink-0 ${isCompactLayout ? 'h-12' : 'h-10'} px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#121215]`}>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([])
              setInput('')
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-white"
            title="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#0A84FF]">
              <path d="M14.5 6.5L9 12L14.5 17.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#0A84FF] bg-[#0A84FF] font-medium text-white">
              Back
            </span>
          </button>
        )}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
          Ask about Itwela
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f6f7fb] dark:bg-[#0b0b0d]">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-white/55 text-sm py-8 px-4 max-w-md mx-auto">
            <p className="font-medium mb-1 text-gray-700 dark:text-white/80">Nat</p>
            <p>I am Nat, Itwela&apos;s AI agent. Ask me about his projects, skills, experience, music, or how to work with him.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-[#0A84FF] text-white'
                  : 'bg-[#e9ebf2] dark:bg-[#2c2c2e] text-gray-800 dark:text-white/95'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-3 py-2 text-sm bg-[#e9ebf2] dark:bg-[#2c2c2e] text-gray-500 dark:text-white/60">
              …
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#111114]">
        <div className="mb-2 text-[10px] text-gray-500 dark:text-white/50 truncate px-1" title={modelUsed}>
          {modelUsed}
        </div>
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Message..."
            rows={1}
            className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-[#f8f9fc] dark:bg-black/25 text-gray-900 dark:text-white text-sm px-4 pt-2.5 pb-2.5 pr-14 outline-none placeholder:text-gray-400 dark:placeholder:text-white/45 focus:ring-2 focus:ring-[#0A84FF]/30 resize-none overflow-y-auto leading-[1.35] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 bottom-2.5 w-8 h-8 rounded-full bg-[#0A84FF] hover:bg-[#2b93ff] disabled:opacity-50 disabled:pointer-events-none text-white flex items-center justify-center transition-colors"
          >
            <FiArrowUp size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
