'use client'

import { useEffect, useState } from 'react'

export type PlayerTrack = {
  id: string
  title: string
  artist: string
  album?: string
  audioUrl?: string | null
  coverUrl?: string | null
  duration?: number | null
  order: number
}

type PlayerState = {
  tracks: PlayerTrack[]
  currentIndex: number
  isPlaying: boolean
  progress: number
  duration: number
  volume: number
  isMuted: boolean
  error: string | null
}

const INITIAL_STATE: PlayerState = {
  tracks: [],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  error: null,
}

class MusicPlayerStore {
  private state: PlayerState = INITIAL_STATE
  private listeners = new Set<(state: PlayerState) => void>()
  private audio: HTMLAudioElement | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio()
      this.audio.preload = 'metadata'
      this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata)
      this.audio.addEventListener('timeupdate', this.onTimeUpdate)
      this.audio.addEventListener('ended', this.onEnded)
      this.audio.addEventListener('error', this.onError)
    }
  }

  private emit() {
    for (const cb of this.listeners) cb(this.state)
  }

  private patch(next: Partial<PlayerState>) {
    this.state = { ...this.state, ...next }
    this.emit()
  }

  private onLoadedMetadata = () => {
    if (!this.audio) return
    if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
      this.patch({ duration: this.audio.duration })
    }
  }

  private onTimeUpdate = () => {
    if (!this.audio || this.audio.duration <= 0) return
    this.patch({ progress: (this.audio.currentTime / this.audio.duration) * 100 })
  }

  private onEnded = () => {
    this.next()
  }

  private onError = () => {
    this.patch({ isPlaying: false, error: 'Unable to load this audio source.' })
  }

  private currentTrack() {
    return this.state.tracks[this.state.currentIndex] ?? null
  }

  subscribe(cb: (state: PlayerState) => void) {
    this.listeners.add(cb)
    cb(this.state)
    return () => {
      this.listeners.delete(cb)
    }
  }

  getState() {
    return this.state
  }

  setTracks(tracks: PlayerTrack[]) {
    const sameLength = this.state.tracks.length === tracks.length
    const sameOrder = sameLength && this.state.tracks.every((t, i) => t.id === tracks[i]?.id)
    if (sameOrder) return

    const currentId = this.currentTrack()?.id
    const nextIndex = currentId ? Math.max(0, tracks.findIndex((t) => t.id === currentId)) : 0
    this.patch({
      tracks,
      currentIndex: tracks.length === 0 ? 0 : nextIndex,
      progress: tracks.length === 0 ? 0 : this.state.progress,
    })
    if (!tracks.length) {
      this.pause()
      return
    }
    if (this.state.isPlaying) this.loadCurrentTrackAndMaybePlay(true)
  }

  playByIndex(index: number) {
    if (!this.state.tracks.length) return
    const safe = Math.max(0, Math.min(index, this.state.tracks.length - 1))
    this.patch({ currentIndex: safe, progress: 0, duration: 0, error: null })
    this.loadCurrentTrackAndMaybePlay(true)
  }

  togglePlayPause() {
    if (this.state.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play() {
    if (!this.audio) return
    const track = this.currentTrack()
    if (!track) return
    if (!this.audio.currentSrc) {
      this.loadCurrentTrackAndMaybePlay(true)
      return
    }
    this.audio.play().then(() => this.patch({ isPlaying: true, error: null })).catch(() => {
      this.patch({ isPlaying: false, error: 'Playback blocked. Try pressing play again.' })
    })
  }

  pause() {
    if (!this.audio) return
    this.audio.pause()
    this.patch({ isPlaying: false })
  }

  next() {
    if (!this.state.tracks.length) return
    const nextIndex = (this.state.currentIndex + 1) % this.state.tracks.length
    this.patch({ currentIndex: nextIndex, progress: 0, duration: 0, error: null })
    this.loadCurrentTrackAndMaybePlay(this.state.isPlaying)
  }

  prev() {
    if (!this.state.tracks.length) return
    const nextIndex = (this.state.currentIndex - 1 + this.state.tracks.length) % this.state.tracks.length
    this.patch({ currentIndex: nextIndex, progress: 0, duration: 0, error: null })
    this.loadCurrentTrackAndMaybePlay(this.state.isPlaying)
  }

  setVolume(volume: number) {
    const safe = Math.max(0, Math.min(1, volume))
    if (this.audio) this.audio.volume = this.state.isMuted ? 0 : safe
    this.patch({ volume: safe })
  }

  toggleMute() {
    const next = !this.state.isMuted
    if (this.audio) this.audio.volume = next ? 0 : this.state.volume
    this.patch({ isMuted: next })
  }

  seekPercent(percent: number) {
    if (!this.audio || this.audio.duration <= 0) return
    const p = Math.max(0, Math.min(100, percent))
    this.audio.currentTime = (p / 100) * this.audio.duration
    this.patch({ progress: p })
  }

  private loadCurrentTrackAndMaybePlay(shouldPlay: boolean) {
    if (!this.audio) return
    const track = this.currentTrack()
    if (!track || !track.audioUrl) {
      this.patch({ isPlaying: false, error: 'This track has no audio URL.' })
      return
    }
    this.audio.pause()
    this.audio.src = track.audioUrl
    this.audio.load()
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume
    if (shouldPlay) {
      this.audio.play().then(() => this.patch({ isPlaying: true, error: null })).catch(() => {
        this.patch({ isPlaying: false, error: 'This track could not be played in-browser.' })
      })
    }
  }
}

export const musicPlayer = new MusicPlayerStore()

export function useMusicPlayer() {
  const [state, setState] = useState<PlayerState>(musicPlayer.getState())
  useEffect(() => musicPlayer.subscribe(setState), [])
  const currentTrack = state.tracks[state.currentIndex] ?? null
  return {
    ...state,
    currentTrack,
    setTracks: (tracks: PlayerTrack[]) => musicPlayer.setTracks(tracks),
    playByIndex: (i: number) => musicPlayer.playByIndex(i),
    togglePlayPause: () => musicPlayer.togglePlayPause(),
    next: () => musicPlayer.next(),
    prev: () => musicPlayer.prev(),
    setVolume: (v: number) => musicPlayer.setVolume(v),
    toggleMute: () => musicPlayer.toggleMute(),
    seekPercent: (p: number) => musicPlayer.seekPercent(p),
  }
}
