'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ReactNode } from 'react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const isPlaceholder =
  !convexUrl ||
  convexUrl.includes('placeholder') ||
  convexUrl === 'https://placeholder.convex.cloud'

const convex = isPlaceholder
  ? null
  : new ConvexReactClient(convexUrl)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (isPlaceholder || !convex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Convex not configured
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Set a real deployment URL in <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">.env.local</code> as <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">NEXT_PUBLIC_CONVEX_URL</code>.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            From the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">client</code> folder (where the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">convex</code> folder is), run: <br />
            <span className="font-mono mt-2 inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npx convex dev</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            That will create or link a Convex deployment and update your env with the correct URL.
          </p>
        </div>
      </div>
    )
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
