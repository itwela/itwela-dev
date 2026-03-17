import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { buildAgentContext, DEFAULT_MODEL_LABEL, OPENROUTER_MODELS } from '@/lib/agent'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function extractTextContent(content: unknown): string {
  if (!content) return ''
  if (typeof content === 'string') return content.trim()
  if (Array.isArray(content)) {
    return content
      .map((chunk) => {
        if (typeof chunk === 'string') return chunk
        if (chunk && typeof chunk === 'object' && 'text' in chunk) return String((chunk as { text: unknown }).text ?? '')
        return ''
      })
      .join('\n')
      .trim()
  }
  return String(content).trim()
}

async function loadPortfolioContext() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl || convexUrl.includes('placeholder')) {
    return ''
  }
  const client = new ConvexHttpClient(convexUrl)
  const data = await client.query(api.export.all, {})
  return buildAgentContext(data)
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env.local.' },
      { status: 503 }
    )
  }

  let body: { messages: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 })
  }

  const cleanedMessages = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-16)

  if (cleanedMessages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  let context = ''
  try {
    context = await loadPortfolioContext()
  } catch (error) {
    console.error('Failed loading Convex context for agent:', error)
  }

  const systemContent = `You are Nat, an AI agent built by Itwela Ibomu.
Your primary purpose is to answer questions about Itwela, his work, his projects, and how people can contact or work with him.
Be concise, friendly, and confident about your role as Nat.
Use only the context below for factual claims. If the context doesn't contain enough information, say so clearly.

--- Context about Itwela (from their site) ---
${context || 'No additional context provided.'}
--- End context ---`

  const openRouterMessages = [
    { role: 'system' as const, content: systemContent },
    ...cleanedMessages.map((m) => ({ role: m.role, content: m.content })),
  ]

  let lastError = ''
  for (const model of OPENROUTER_MODELS) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.get('origin') || 'https://itwela.dev',
      },
      body: JSON.stringify({
        model,
        messages: openRouterMessages,
        temperature: 0.2,
        max_tokens: 900,
      }),
    })

    if (!res.ok) {
      lastError = await res.text()
      continue
    }

    const data = await res.json()
    const choice = data.choices?.[0]
    const content = extractTextContent(choice?.message?.content)
    const modelLabel = data.model ?? model
    if (!content) {
      lastError = 'Model returned empty content.'
      continue
    }
    return NextResponse.json({ content, model: modelLabel })
  }

  return NextResponse.json(
    { error: 'OpenRouter request failed', details: lastError || 'No free model produced a response.' },
    { status: 502 }
  )
}
