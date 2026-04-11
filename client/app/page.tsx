import { Desktop } from '@/components/desktop/Desktop'

type HomeProps = {
  searchParams?: {
    blog?: string | string[]
    app?: string | string[]
    track?: string | string[]
    photo?: string | string[]
    card?: string | string[]
    [key: string]: string | string[] | undefined
  }
}

export default function Home({ searchParams }: HomeProps) {
  const rawBlog = searchParams?.blog
  const initialBlogSlug = Array.isArray(rawBlog) ? rawBlog[0] : rawBlog

  const rawApp = searchParams?.app
  const initialApp = Array.isArray(rawApp) ? rawApp[0] : rawApp

  const rawTrack = searchParams?.track
  const initialTrackId = Array.isArray(rawTrack) ? rawTrack[0] : rawTrack

  const rawPhoto = searchParams?.photo
  const initialPhotoId = Array.isArray(rawPhoto) ? rawPhoto[0] : rawPhoto

  const rawCard = searchParams?.card
  const initialCardId = Array.isArray(rawCard) ? rawCard[0] : rawCard

  return (
    <Desktop
      initialBlogSlug={initialBlogSlug}
      initialApp={initialApp}
      initialTrackId={initialTrackId}
      initialPhotoId={initialPhotoId}
      initialCardId={initialCardId}
    />
  )
}
