import { DesktopCard } from './types'

// Card size presets: mix of orientations (portrait tall, portrait short, landscape)
const CARD_PRESETS: { w: number; h: number }[] = [
  { w: 120, h: 260 },  // portrait tall
  { w: 130, h: 240 },  // portrait
  { w: 115, h: 250 },  // portrait slim
  { w: 200, h: 140 },  // landscape wide
  { w: 180, h: 150 },  // landscape
  { w: 140, h: 220 },  // portrait medium
]

type LayoutItem = Pick<DesktopCard, 'id' | 'x' | 'y' | 'width' | 'height' | 'rotation'>

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

type CardBase = Omit<DesktopCard, 'x' | 'y' | 'width' | 'height' | 'rotation' | 'zIndex'>

/**
 * Generates a no-overlap random layout for any set of cards.
 * Divides the screen into a grid of slots, shuffles both slots and cards,
 * then assigns one slot per card with a small jitter.
 */
export function generateLayoutForCards(bases: CardBase[]): LayoutItem[] {
  const isClient = typeof window !== 'undefined'
  const w = isClient ? window.innerWidth : 1280
  const h = isClient ? window.innerHeight : 800
  const menuH = 28
  const dockH = 100
  const pad = 40
  // Keep cards non-overlapping but make the cluster feel tighter.
  const clusterScaleX = 0.86
  const clusterScaleY = 0.84
  const count = bases.length
  const cols = Math.ceil(Math.sqrt(count * (w / h)))
  const rows = Math.ceil(count / cols)
  const usableW = w - pad * 2
  const usableH = h - menuH - dockH - pad * 2
  const clusterW = usableW * clusterScaleX
  const clusterH = usableH * clusterScaleY
  const clusterStartX = pad + (usableW - clusterW) / 2
  const clusterStartY = menuH + pad + (usableH - clusterH) / 2
  const slotW = clusterW / cols
  const slotH = clusterH / rows
  const maxCardW = Math.min(slotW - 20, 200)
  const maxCardH = Math.min(slotH - 20, 260)

  const slots: { x: number; y: number }[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      slots.push({
        x: clusterStartX + col * slotW + slotW / 2,
        y: clusterStartY + row * slotH + slotH / 2,
      })
    }
  }

  const shuffledSlots = shuffle(slots).slice(0, count)
  const shuffledBases = shuffle([...bases])

  return shuffledBases.map((base, i) => {
    const slot = shuffledSlots[i]
    const o = (base as CardBase & { orientation?: string }).orientation
    let width: number
    let height: number
    if (o === 'square') {
      const side = Math.min(maxCardW, maxCardH)
      width = side; height = side
    } else if (o === 'phone') {
      const ratio = 1849 / 854
      const labelH = 28
      let pw = Math.min(260, maxCardW)
      let ph = Math.round(pw * ratio) + labelH
      if (ph > maxCardH) { ph = maxCardH; pw = Math.round((ph - labelH) / ratio) }
      width = pw; height = ph
    } else if (o === 'landscape') {
      width = Math.min(200, maxCardW); height = Math.min(140, maxCardH)
    } else if (o === 'portrait') {
      const ratio = 1871 / 1345
      const labelH = 28
      let pw = Math.min(220, maxCardW)
      let ph = Math.round(pw * ratio) + labelH
      if (ph > maxCardH) { ph = maxCardH; pw = Math.round((ph - labelH) / ratio) }
      width = pw; height = ph
    } else {
      const preset = CARD_PRESETS[Math.floor(Math.random() * CARD_PRESETS.length)]
      width = Math.min(preset.w, maxCardW); height = Math.min(preset.h, maxCardH)
    }
    const jitterX = randomBetween(-slotW * 0.18, slotW * 0.18)
    const jitterY = randomBetween(-slotH * 0.18, slotH * 0.18)
    const x = Math.max(pad, Math.min(w - pad - width, slot.x - width / 2 + jitterX))
    const y = Math.max(menuH + pad, Math.min(h - dockH - pad - height, slot.y - height / 2 + jitterY))
    return {
      id: base.id,
      x: Math.round(x),
      y: Math.round(y),
      width,
      height,
      rotation: randomBetween(-6, 6),
    }
  })
}

function buildCardsFromLayout(bases: CardBase[], layout: LayoutItem[]): DesktopCard[] {
  return bases.map((base) => {
    const pos = layout.find((l) => l.id === base.id) ?? { x: 60, y: 80, width: 130, height: 200, rotation: 0 }
    return { ...base, ...pos, zIndex: 1 }
  })
}

// Empty initial state — everything comes from Convex
export const CARDS_ORGANIZED: DesktopCard[] = []

type ConvexCard = {
  _id: string
  cardType: 'project' | 'achievement' | 'role' | 'skill' | 'about' | 'social' | 'education' | 'resume' | 'client'
  title: string
  description: string
  longDescription: string
  tags: string[]
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  order: number
  body?: string
  highlights?: string[]
  company?: string
  period?: string
  links?: { name: string; url: string; icon: string }[]
  orientation?: 'portrait' | 'landscape' | 'square' | 'phone'
}

/** Builds all desktop cards from Convex data, laid out together with no overlaps. */
export function buildAllCards(convexItems: ConvexCard[]): DesktopCard[] {
  const bases: CardBase[] = convexItems.map((item) => ({
    id: `card-convex-${item._id}`,
    title: item.title,
    label: item.title,
    content: buildCardContent(item),
    imageUrl: item.imageUrl || undefined,
    orientation: item.orientation,
  }))
  const layout = generateLayoutForCards(bases)
  return buildCardsFromLayout(bases, layout)
}

function buildCardContent(item: ConvexCard): DesktopCard['content'] {
  switch (item.cardType) {
    case 'achievement':
      return { type: 'achievement', title: item.title, description: item.description, body: item.longDescription || item.body, highlights: item.highlights ?? [], tags: item.tags }
    case 'role':
      return { type: 'role', title: item.title, company: item.company ?? '', period: item.period ?? '', description: item.description, body: item.longDescription || item.body, highlights: item.highlights ?? [], tags: item.tags }
    case 'about':
      return {
        type: 'about',
        name: item.title,
        role: item.description,
        bio: item.longDescription || item.body || '',
        body: item.body ?? undefined,
        highlights: item.highlights,
        tags: item.tags,
      }
    case 'skill':
      return { type: 'skill', title: item.title, category: item.description, skills: item.tags }
    case 'social':
      return { type: 'social', title: item.title, description: item.description, links: item.links ?? [] }
    case 'education':
      return { type: 'education', school: item.title, degree: item.description, location: item.company ?? '', period: item.period ?? '', coursework: item.longDescription }
    case 'resume':
      return { type: 'resume', name: item.title, citizenship: item.description, email: item.body ?? '', links: item.links ?? [] }
    case 'client':
      return { type: 'client', title: item.title, company: item.company ?? '', period: item.period ?? '', description: item.description, highlights: item.highlights ?? [], tags: item.tags }
    default:
      return { type: 'project', title: item.title, description: item.description, body: item.body, highlights: item.highlights, tags: item.tags, url: item.liveUrl || undefined, github: item.githubUrl || undefined }
  }
}

export const PLACEHOLDER_PHOTOS = {
  software: [
    { id: '1', title: 'Hackathon Win', imageUrl: '', category: 'software' },
    { id: '2', title: 'Side Project Launch', imageUrl: '', category: 'software' },
    { id: '3', title: 'First Deploy', imageUrl: '', category: 'software' },
    { id: '4', title: 'Team Collab', imageUrl: '', category: 'software' },
    { id: '5', title: 'Code Review', imageUrl: '', category: 'software' },
    { id: '6', title: 'Demo Day', imageUrl: '', category: 'software' },
  ],
  art: [
    { id: '7', title: 'Digital Art #1', imageUrl: '', category: 'art' },
    { id: '8', title: 'Cover Art', imageUrl: '', category: 'art' },
    { id: '9', title: 'Visual Design', imageUrl: '', category: 'art' },
    { id: '10', title: 'Abstract', imageUrl: '', category: 'art' },
  ],
  memories: [
    { id: '11', title: 'Good Times', imageUrl: '', category: 'memories' },
    { id: '12', title: 'Studio Session', imageUrl: '', category: 'memories' },
    { id: '13', title: 'Road Trip', imageUrl: '', category: 'memories' },
    { id: '14', title: 'Celebration', imageUrl: '', category: 'memories' },
  ],
}

export const PLACEHOLDER_MUSIC = [
  { id: '1', title: 'Midnight Sessions', artist: 'itwela', album: 'Vol. 1', duration: 187, order: 1, coverUrl: '' },
  { id: '2', title: 'Purple Haze (Remix)', artist: 'itwela', album: 'Vol. 1', duration: 214, order: 2, coverUrl: '' },
  { id: '3', title: 'Frequency', artist: 'itwela', album: 'Singles', duration: 198, order: 3, coverUrl: '' },
  { id: '4', title: 'Lo-Fi Dreams', artist: 'itwela', album: 'Singles', duration: 165, order: 4, coverUrl: '' },
  { id: '5', title: 'Late Night Drive', artist: 'itwela', album: 'Vol. 2', duration: 232, order: 5, coverUrl: '' },
  { id: '6', title: 'Ascend', artist: 'itwela', album: 'Vol. 2', duration: 201, order: 6, coverUrl: '' },
]

export const PLACEHOLDER_PROJECTS = [
  {
    id: '1',
    title: 'JobKompass',
    description: 'AI job tracker that writes your resume for you',
    longDescription: 'Multi-tenant SaaS with an AI agent backed by 12 custom tools that auto-generates tailored resumes & cover letters, tracks applications, and coaches your performance — cutting end-to-end prep time by 50%+. Includes a Chrome extension that parses any live job listing in one click, a containerized LaTeX microservice on Railway for ATS-optimized PDFs, and Stripe-gated subscription tiers enforced server-side via webhooks.',
    tags: ['Next.js', 'Convex', 'OpenAI Agents SDK', 'Stripe', 'LaTeX', 'Chrome Extension'],
    liveUrl: 'https://www.myjobkompass.com/',
    githubUrl: 'https://github.com/itwela',
    featured: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Integrity',
    description: '$10K+ in digital product sales — audiobook, album & fragrance storefront',
    longDescription: 'End-to-end technical delivery for a multi-format digital product drop: React + Convex storefront, Stripe checkout with access provisioning, and a fulfillment mini-app that ingests carrier tracking numbers and automates shipment-status emails. Also built "Lotus," a custom audiobook generation app, and an Apple-Music-style web player for secure on-site streaming. Enabled $10K+ in gross sales and supported 100+ listeners at launch.',
    tags: ['React', 'Convex', 'Stripe', 'Authentication', 'Email Automation'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Lotus',
    description: 'iOS AI wellness app — narrated audiobooks, five-figure revenue',
    longDescription: 'iOS app with an API-driven agent pipeline orchestrating LLMs and multimodal generators for automated title, content, audio narration, and image creation — all while enforcing content and ethical guidelines. Produced the audiobook narration used by my father, packaged audio + book bundles, and contributed to five-figure revenue from album and book sales.',
    tags: ['React Native', 'Replicate', 'OpenAI', 'Convex'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: true,
    order: 3,
  },
  {
    id: '4',
    title: 'CitySwipe',
    description: '200 users, 50K impressions — AI vacation planner built in a week',
    longDescription: 'Led a team of 3 to build an AI travel planner with swipeable, LLM-powered destination recommendations backed by vector search for context-aware suggestions. Won 1st place out of 300+ teams in a nationwide hackathon, then scaled to 200+ users and 50K+ impressions.',
    tags: ['Next.js', 'LangChain', 'Pinecone', 'Supabase'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: true,
    order: 4,
  },
  {
    id: '5',
    title: 'Jelly Up!',
    description: 'Auto-captioning pipeline — 2nd place at Headstarter Hackathon',
    longDescription: 'Automated subtitle generation and burned-in captions using Whisper for ASR and OpenCV for frame alignment, producing both SRT and burned-in caption files. Placed 2nd at the Headstarter Hiring Hackathon.',
    tags: ['Next.js', 'Whisper', 'OpenCV', 'Docker', 'FFmpeg'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: false,
    order: 5,
  },
  {
    id: '6',
    title: 'Globetrotter AI',
    description: 'Voice travel assistant — 1st place at Headstarter Hackathon',
    longDescription: 'Voice-activated travel planner integrating speech recognition, LLM itinerary planning, third-party travel APIs, and Google TTS for spoken responses. Won 1st place at the Headstarter Hiring Hackathon.',
    tags: ['Flask', 'Python', 'OpenAI', 'Google TTS', 'React Three Fiber'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: false,
    order: 6,
  },
  {
    id: '7',
    title: 'Dope Marketing AI Platform',
    description: 'Internal AI platform cutting manual research from hours to minutes',
    longDescription: 'Built an internal AI platform adopted by 3 managers to automate account research and data analysis. Created APIs giving agents instant access to millions of housing and client records. Delivered 3 production tools that enhanced research efficiency across departments.',
    tags: ['AI Agents', 'Python', 'API Design', 'OpenAI', 'TypeScript'],
    liveUrl: '',
    githubUrl: 'https://github.com/itwela',
    featured: false,
    order: 7,
  },
]
