export const OPENROUTER_MODELS = [
  'arcee-ai/trinity-large-preview:free',
] as const

export const DEFAULT_MODEL_LABEL = OPENROUTER_MODELS[0]

type PortfolioProject = {
  title: string
  description: string
  longDescription?: string
  tags?: string[]
  cardType?: string
  company?: string
  period?: string
}

type PortfolioTrack = {
  title: string
  artist: string
  album?: string
}

type PortfolioPlaylist = {
  name: string
  trackIds?: string[]
}

type PortfolioPhoto = {
  title: string
  category: string
}

type PortfolioResume = {
  name?: string
  email?: string
  linkedin?: string
  github?: string
  experience?: Array<{ title: string; company: string; period: string; bullets: string[] }>
  projects?: Array<{ title: string; tech: string; bullets: string[]; url?: string }>
  skills?: Array<{ group: string; items: string }>
}

export type PortfolioContextPayload = {
  homescreenCards?: {
    projects?: PortfolioProject[]
    roles?: PortfolioProject[]
    clients?: PortfolioProject[]
    achievements?: PortfolioProject[]
    skills?: PortfolioProject[]
    about?: PortfolioProject[]
    social?: PortfolioProject[]
  }
  resume?: PortfolioResume | null
  music?: {
    tracks?: PortfolioTrack[]
    playlists?: PortfolioPlaylist[]
  }
  photos?: PortfolioPhoto[]
  mailResponses?: Array<{ name: string; email: string; subject: string; message: string; createdAt: number }>
}

export function buildAgentContext(data: PortfolioContextPayload): string {
  const lines: string[] = []

  const aboutCard = data.homescreenCards?.about?.[0]
  if (aboutCard) {
    lines.push(`ABOUT: ${aboutCard.title} — ${aboutCard.description}`)
    if (aboutCard.longDescription) lines.push(`BIO: ${aboutCard.longDescription}`)
  }

  const projectBuckets = [
    ...(data.homescreenCards?.projects ?? []),
    ...(data.homescreenCards?.roles ?? []),
    ...(data.homescreenCards?.clients ?? []),
    ...(data.homescreenCards?.achievements ?? []),
  ]
  if (projectBuckets.length > 0) {
    lines.push(
      'PROJECTS: ' +
        projectBuckets
          .slice(0, 20)
          .map((p) => {
            const meta = [p.company, p.period].filter(Boolean).join(' · ')
            const tags = (p.tags ?? []).slice(0, 8).join(', ')
            return `${p.title}: ${p.description}${meta ? ` (${meta})` : ''}${tags ? ` [${tags}]` : ''}`
          })
          .join(' | ')
    )
  }

  const skills = data.resume?.skills ?? []
  if (skills.length > 0) {
    lines.push(
      'SKILLS: ' +
        skills
          .map((s) => `${s.group}: ${s.items}`)
          .join(' | ')
    )
  }

  const exp = data.resume?.experience ?? []
  if (exp.length > 0) {
    lines.push(
      'EXPERIENCE: ' +
        exp
          .slice(0, 8)
          .map((e) => `${e.title} @ ${e.company} (${e.period})`)
          .join(' | ')
    )
  }

  const resumeProjects = data.resume?.projects ?? []
  if (resumeProjects.length > 0) {
    lines.push(
      'RESUME PROJECTS: ' +
        resumeProjects
          .slice(0, 10)
          .map((p) => `${p.title}${p.tech ? ` [${p.tech}]` : ''}`)
          .join(' | ')
    )
  }

  const tracks = data.music?.tracks ?? []
  if (tracks.length > 0) {
    lines.push(
      'MUSIC: ' +
        tracks
          .slice(0, 30)
          .map((t) => `${t.title} by ${t.artist}${t.album ? ` (${t.album})` : ''}`)
          .join(' | ')
    )
  }

  const playlists = data.music?.playlists ?? []
  if (playlists.length > 0) {
    lines.push(
      'PLAYLISTS: ' +
        playlists
          .map((p) => `${p.name}${p.trackIds ? ` (${p.trackIds.length} tracks)` : ''}`)
          .join(' | ')
    )
  }

  const photos = data.photos ?? []
  if (photos.length > 0) {
    lines.push(
      'PHOTOS: ' +
        photos
          .slice(0, 25)
          .map((p) => `${p.title} [${p.category}]`)
          .join(' | ')
    )
  }

  if (data.resume?.name || data.resume?.email || data.resume?.linkedin || data.resume?.github) {
    lines.push(
      `CONTACT: ${data.resume?.name ?? ''} | ${data.resume?.email ?? ''} | ${data.resume?.linkedin ?? ''} | ${data.resume?.github ?? ''}`.trim()
    )
  }

  return lines.join('\n')
}

