import { Desktop } from '@/components/desktop/Desktop'

type HomeProps = {
  searchParams?: {
    blog?: string | string[]
    [key: string]: string | string[] | undefined
  }
}

export default function Home({ searchParams }: HomeProps) {
  const raw = searchParams?.blog
  const initialBlogSlug = Array.isArray(raw) ? raw[0] : raw
  return <Desktop initialBlogSlug={initialBlogSlug} />
}
