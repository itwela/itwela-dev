'use client'

export function JobKompassApp() {
  return (
    <div className="h-full w-full bg-white dark:bg-[#0f1012] flex flex-col">
      <div className="h-10 px-3 flex items-center justify-between gap-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121316]">
        <p className="text-[11px] text-gray-600 dark:text-white/65 truncate min-w-0">
          Live product experience: This is the actual JobKompass app I built.
        </p>
        <a
          href="https://www.myjobkompass.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] px-2 py-1 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 whitespace-nowrap"
        >
          Try it live
        </a>
      </div>
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          src="https://www.myjobkompass.com/"
          title="JobKompass"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    </div>
  )
}
