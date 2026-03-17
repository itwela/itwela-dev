export type AppId = 'finder' | 'mail' | 'photos' | 'music' | 'resume' | 'blog' | 'agent' | 'jobkompass' | 'terminal'

export type CardLayout = 'scattered' | 'organized'

export type WindowState = {
  id: string
  appId: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export type DesktopCard = {
  id: string
  title: string
  label: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  content: CardContent
  zIndex: number
  imageUrl?: string
  orientation?: 'portrait' | 'landscape' | 'square' | 'phone'
}

export type CardContent =
  | { type: 'project'; title: string; description: string; body?: string; highlights?: string[]; tags: string[]; url?: string; github?: string }
  | { type: 'achievement'; title: string; description: string; body?: string; highlights: string[]; tags: string[] }
  | { type: 'role'; title: string; company: string; period: string; description: string; body?: string; highlights: string[]; tags: string[] }
  | { type: 'about'; bio: string; name: string; role: string; body?: string; highlights?: string[]; tags: string[] }
  | { type: 'image'; imageUrl: string; caption?: string }
  | { type: 'music'; trackName: string; artist: string; coverUrl?: string }
  | { type: 'skill'; title: string; skills: string[]; category: string }
  | { type: 'social'; title: string; description: string; links: { name: string; url: string; icon: string }[] }
  | { type: 'education'; school: string; degree: string; location: string; period: string; coursework: string }
  | { type: 'client'; title: string; company: string; period: string; description: string; highlights: string[]; tags: string[] }
  | { type: 'resume'; name: string; citizenship: string; email: string; links: { name: string; url: string; icon: string }[] }

export type DockApp = {
  id: AppId
  name: string
  icon: string
}
