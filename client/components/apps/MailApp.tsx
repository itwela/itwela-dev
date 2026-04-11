'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { FiSend, FiPaperclip, FiImage, FiX } from 'react-icons/fi'
import { MdOutlineFormatBold, MdOutlineFormatItalic } from 'react-icons/md'

type AttachmentItem = {
  name: string
  type: string
  size: number
}

const MAX_IMAGE_ATTACHMENT_SIZE = 5 * 1024 * 1024

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function plainTextFromHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export function MailApp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [copiedLink, setCopiedLink] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [isCompactLayout, setIsCompactLayout] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  const submitContact = useMutation(api.contacts.submitContact)

  const applyFormat = (command: 'bold' | 'italic') => {
    const editor = messageRef.current
    if (!editor) return
    editor.focus()
    document.execCommand(command)
    setForm((prev) => ({ ...prev, message: editor.innerHTML }))
  }

  const handleAttachmentSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const next: AttachmentItem[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        continue
      }
      if (file.size > MAX_IMAGE_ATTACHMENT_SIZE) {
        toast.error(`${file.name} is too large (max 5MB)`)
        continue
      }
      next.push({ name: file.name, type: file.type, size: file.size })
    }

    if (next.length) {
      setAttachments((prev) => [...prev, ...next].slice(0, 6))
    }
    e.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const update = () => setIsCompactLayout(window.innerWidth <= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const resetComposer = () => {
    setForm({ name: '', email: '', subject: '', message: '' })
    setAttachments([])
    if (messageRef.current) messageRef.current.innerHTML = ''
  }

  const copyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itwela.dev'
    const url = `${origin}/?app=mail`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 1800)
    } catch {
      // ignore
    }
  }

  const handleSend = async () => {
    const plainMessage = plainTextFromHtml(form.message)
    if (!form.name || !form.email || !form.subject || !plainMessage) {
      toast.error('Please fill in all fields')
      return
    }
    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setSending(true)
    try {
      await submitContact({
        ...form,
        message: plainMessage,
        attachments,
      })
      setSent(true)
      toast.custom(() => (
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-[12px] bg-white/10 flex items-center justify-center flex-shrink-0">
            <img
              src="/mialicon.png"
              alt="Contact"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0 pt-0.5">
            <div data-title>Contact</div>
            <div data-description>Sent.</div>
          </div>
        </div>
      ))
      resetComposer()
      setTimeout(() => setSent(false), 3000)
    } catch {
      toast.error('Something went wrong. Try again!')
    } finally {
      setSending(false)
    }
  }

  if (isCompactLayout) {
    return (
      <div className="h-full bg-white dark:bg-[#111215] text-gray-900 dark:text-white flex flex-col">
        <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-[26px] leading-none text-gray-900 dark:text-white/95 font-semibold">Contact me</div>
            <button
              onClick={handleSend}
              disabled={sending || sent}
              className="w-9 h-9 rounded-full bg-blue-500 dark:bg-white/20 border border-blue-500 dark:border-white/20 flex items-center justify-center disabled:opacity-50"
              title="Send"
            >
              <FiSend size={17} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <span className="text-gray-500 dark:text-white/45 text-[17px] w-20">To:</span>
            <span className="text-gray-900 dark:text-white/90 text-[17px] flex-1 truncate">iibomu@wgu.edu</span>
            <button onClick={() => fileInputRef.current?.click()} className="text-blue-400">
              <FiPaperclip size={17} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <span className="text-gray-500 dark:text-white/45 text-[17px] w-20">Name:</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="flex-1 bg-transparent text-[17px] text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/25"
            />
          </div>

          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <span className="text-gray-500 dark:text-white/45 text-[17px]">Cc/Bcc, From:</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              type="email"
              className="flex-1 bg-transparent text-[17px] text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/25"
            />
          </div>

          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <span className="text-gray-500 dark:text-white/45 text-[17px] w-20">Subject:</span>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder=""
              className="flex-1 bg-transparent text-[17px] text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/25"
            />
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center justify-end gap-2 mb-2 text-gray-500 dark:text-white/55">
              <button onClick={() => applyFormat('bold')} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><MdOutlineFormatBold size={16} /></button>
              <button onClick={() => applyFormat('italic')} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><MdOutlineFormatItalic size={16} /></button>
            </div>
            <div className="relative min-h-[180px]">
              <div
                ref={messageRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setForm({ ...form, message: e.currentTarget.innerHTML })}
                className="w-full min-h-[180px] bg-transparent text-gray-900 dark:text-white text-[15px] outline-none leading-relaxed"
              />
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-[11px] text-gray-500 dark:text-white/45">Attachments ({attachments.length})</div>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <FiImage size={12} className="text-blue-500 dark:text-blue-300" />
                      <span className="text-xs text-gray-800 dark:text-white/85 max-w-[160px] truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-500 dark:text-white/45">{formatFileSize(file.size)}</span>
                      <button onClick={() => removeAttachment(i)} className="text-gray-500 hover:text-gray-800 dark:text-white/50 dark:hover:text-white/80" title="Remove attachment">
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleAttachmentSelect}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full text-gray-900 dark:text-white bg-white dark:bg-[#111215]">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 overflow-y-auto finder-sidebar">
        <div className="px-3 py-3">
          <div className="text-gray-500 dark:text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-2">Compose</div>
          <div className="text-gray-600 dark:text-white/40 text-xs leading-relaxed">
            Reach out about projects, collabs, or just to say hi!
          </div>
        </div>
      </div>

      {/* Compose area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compose toolbar */}
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-b border-gray-200 dark:border-white/10" style={{ height: '40px' }}>
          <span className="text-gray-500 dark:text-white/50 text-xs">Contact me</span>
          <div className="flex items-center gap-2 text-gray-500 dark:text-white/40">
            <button
              onClick={copyLink}
              className="hover:text-gray-700 dark:hover:text-white/70 transition-colors px-1.5 py-1 rounded text-[10px]"
              title="Copy link to Mail"
            >
              {copiedLink ? '✓ Copied' : '⎘ Copy Link'}
            </button>
            <button
              onClick={() => applyFormat('bold')}
              className="hover:text-gray-700 dark:hover:text-white/70 transition-colors p-1 rounded"
              title="Bold"
            >
              <MdOutlineFormatBold size={14} />
            </button>
            <button
              onClick={() => applyFormat('italic')}
              className="hover:text-gray-700 dark:hover:text-white/70 transition-colors p-1 rounded"
              title="Italic"
            >
              <MdOutlineFormatItalic size={14} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hover:text-gray-700 dark:hover:text-white/70 transition-colors p-1 rounded"
              title="Attach images"
            >
              <FiPaperclip size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAttachmentSelect}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-2 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 py-2">
              <span className="text-gray-500 dark:text-white/40 text-sm w-16 flex-shrink-0">To:</span>
              <span className="text-gray-800 dark:text-white/80 text-sm">iibomu@wgu.edu</span>
            </div>
          </div>

          <div className="px-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 py-2">
              <span className="text-gray-500 dark:text-white/40 text-sm w-16 flex-shrink-0">Name:</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder-gray-400 dark:placeholder-white/25"
              />
            </div>
          </div>

          <div className="px-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 py-2">
              <span className="text-gray-500 dark:text-white/40 text-sm w-16 flex-shrink-0">From:</span>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                type="email"
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder-gray-400 dark:placeholder-white/25"
              />
            </div>
          </div>

          <div className="px-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 py-2">
              <span className="text-gray-500 dark:text-white/40 text-sm w-16 flex-shrink-0">Subject:</span>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's up?"
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder-gray-400 dark:placeholder-white/25"
              />
            </div>
          </div>

          <div className="px-6 pt-3 pb-4 flex-1">
            <div className="relative min-h-[170px]">
              {!plainTextFromHtml(form.message) && (
                <span className="pointer-events-none absolute left-0 top-0 text-sm text-gray-400 dark:text-white/25">
                  Write your message...
                </span>
              )}
              <div
                ref={messageRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setForm({ ...form, message: e.currentTarget.innerHTML })}
                className="w-full min-h-[170px] bg-transparent text-gray-900 dark:text-white text-sm outline-none leading-relaxed"
              />
            </div>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-[11px] text-gray-500 dark:text-white/40">Attachments ({attachments.length})</div>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                    >
                      <FiImage size={12} className="text-blue-500" />
                      <span className="text-xs text-gray-700 dark:text-white/80 max-w-[180px] truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-500 dark:text-white/40">{formatFileSize(file.size)}</span>
                      <button
                        onClick={() => removeAttachment(i)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
                        title="Remove attachment"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Send button */}
        <div className="px-6 py-3 flex items-center justify-between flex-shrink-0 border-t border-gray-200 dark:border-white/10">
          <span className="text-gray-500 dark:text-white/30 text-xs">
            {sending ? 'Sending...' : sent ? '✓ Sent!' : 'Hit send when ready'}
          </span>
          <motion.button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: sending || sent ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.8)',
              color: 'white',
            }}
            whileHover={{ scale: sending || sent ? 1 : 1.03 }}
            whileTap={{ scale: sending || sent ? 1 : 0.97 }}
            animate={sent ? { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.35 }}
          >
            <FiSend size={13} />
            {sending ? 'Sending...' : sent ? 'Sent!' : 'Send'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
