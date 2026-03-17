import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('resume').collect()
    return rows[0] ?? null
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('resume').collect()
    if (existing.length > 0) return 'already exists'
    await ctx.db.insert('resume', {
      name: 'Itwela Ibomu',
      citizenship: 'US Citizen',
      email: 'iibomu@wgu.edu',
      linkedin: 'https://linkedin.com/in/itwela',
      github: 'https://github.com/itwela',
      downloadUrl: '',
      education: [
        {
          school: 'Western Governors University (WGU)',
          degree: 'B.S. in Software Engineering',
          location: 'Salt Lake City, UT',
          period: 'December 2026 (Estimated)',
          coursework: 'Data Structures & Algorithms · Python · Front-End Web Development · JavaScript',
        },
      ],
      experience: [
        {
          title: 'AI Engineer',
          company: 'Dope Marketing',
          location: 'Remote (HQ: Minnesota)',
          period: 'Jul 2025 – Dec 2025',
          bullets: [
            'Built internal AI platform used by 3 managers to automate account research and data analysis.',
            'Created APIs granting agents instant access to millions of housing and client records, cutting manual lookup time from hours to minutes.',
            'Delivered 3 production tools adopted by management, enhancing research efficiency across departments.',
          ],
        },
        {
          title: 'Software Engineering Fellow',
          company: 'Headstarter',
          location: 'Remote (HQ: San Francisco, CA)',
          period: 'Jul 2024 – Sep 2024',
          bullets: [
            'Led a team of 3 to build CitySwipe, an AI vacation planner with 200 users and 50K+ impressions.',
            'Won 1st place out of 300+ teams in a nationwide hackathon for innovation and product execution.',
            'Shipped 5 AI web apps using Next.js, LangChain, and Supabase; scaled multiple to 200+ users.',
          ],
        },
        {
          title: 'AI Engineer',
          company: 'Dataforce',
          location: 'Atlanta, GA',
          period: 'Apr 2024 – Jun 2024',
          bullets: [
            'Reduced captioning error rates by 20% across 200 videos/day through workflow optimization.',
            'Improved data processing consistency and automated recurring QA checks for higher reliability.',
          ],
        },
      ],
      projects: [
        {
          title: 'Integrity',
          tech: 'React, Convex, Stripe, Authentication, Email Automation',
          bullets: [
            'Led end-to-end technical delivery for Integrity by building a React + Convex storefront and Stripe checkout/access provisioning that enabled $10K+ gross sales and supported 100+ listeners.',
            'Architected and built "Lotus," a custom audiobook generation app, and an Apple-Music-style web player to provide secure, on-site streaming and seamless digital delivery.',
            'Developed a fulfillment mini-app to ingest carrier tracking numbers, automate shipment-status emails, and centralize order management.',
          ],
        },
        {
          title: 'Lotus',
          tech: 'React Native, Replicate, OpenAI, Convex',
          bullets: [
            'Built an iOS app with an API-driven agent pipeline to orchestrate LLMs and multimodal generators for automated title, content, audio narration, and image generation while enforcing content and ethical guidelines.',
            'Produced audiobook narration used by my father; packaged audio + book bundles and generated five-figure revenue from album and book sales.',
            'Developed a monetization and pricing strategy by analyzing dozens of model cost/performance tradeoffs to ensure profitable unit economics.',
          ],
        },
        {
          title: 'JobKompass',
          tech: 'Next.js, React, Convex, OpenAI Agents SDK, Stripe, LaTeX',
          url: 'https://www.myjobkompass.com/',
          bullets: [
            'Engineered a multi-tenant SaaS platform with an AI agent backed by 12 custom tools that autonomously generates tailored resumes and cover letters, tracks job applications, and delivers AI-coached performance analytics reducing end-to-end prep time by 50%+.',
            'Architected a document generation pipeline integrating OpenAI GPT models with a containerized LaTeX microservice on Railway to produce ATS-optimized PDFs, with subscription-gated usage enforced server-side via Stripe webhooks.',
            'Built a Chrome extension with API-key authentication that parses live job listings from any webpage using a multi-provider LLM fallback strategy, automatically extracting structured data into the user\'s job tracker in one click.',
          ],
        },
        {
          title: 'Jelly Up!',
          tech: 'Next.js, Whisper, OpenCV, Docker, FFmpeg',
          bullets: [
            'Automated subtitles and burned-in captions with Whisper and OpenCV; judged 2nd place at Headstarter Hiring Hackathon.',
            'Architected an end-to-end automated captioning pipeline using Whisper for ASR and OpenCV for frame alignment, producing both SRT and burned-in captions.',
            'Improved caption sync and robustness by implementing frame-alignment heuristics and encoding automation for reliable demos.',
          ],
        },
        {
          title: 'CitySwipe',
          tech: 'Next.js, LangChain, Pinecone, Supabase',
          bullets: [
            'Designed personalized travel recommendation flows using LLMs plus vector search for context-aware suggestions; reached 200+ users and 50K+ impressions.',
          ],
        },
        {
          title: 'Globetrotter AI',
          tech: 'Flask, Python, OpenAI, Google TTS, React Three Fiber',
          bullets: [
            'Built a voice-activated travel assistant integrating speech recognition, LLM planning, and third-party travel APIs to produce itinerary suggestions and spoken responses.',
            'Won 1st place at the Headstarter Hiring Hackathon for voice UX, API integrations, and production-ready demo.',
          ],
        },
      ],
      skills: [
        {
          group: 'Languages',
          items: 'SDLC, Object Oriented Programming, LangChain, LangGraph, Python, TypeScript, React, Next.js, React Native, Node.js, PostgreSQL, Supabase, Docker, Pinecone, OpenAI, Convex, Replicate',
        },
        {
          group: 'Additional Skills',
          items: 'J.P. Morgan Software Engineering Job Simulation, Prompt engineering, RAG / Vector Search, API design, Product Development, UI/UX Design, Agile, Leadership',
        },
      ],
    })
    return 'seeded'
  },
})

export const update = mutation({
  args: {
    id: v.id('resume'),
    name: v.string(),
    citizenship: v.string(),
    email: v.string(),
    linkedin: v.string(),
    github: v.string(),
    downloadUrl: v.optional(v.string()),
    education: v.array(v.object({
      school: v.string(),
      degree: v.string(),
      location: v.string(),
      period: v.string(),
      coursework: v.optional(v.string()),
    })),
    experience: v.array(v.object({
      title: v.string(),
      company: v.string(),
      location: v.string(),
      period: v.string(),
      bullets: v.array(v.string()),
    })),
    projects: v.array(v.object({
      title: v.string(),
      tech: v.string(),
      bullets: v.array(v.string()),
      url: v.optional(v.string()),
    })),
    skills: v.array(v.object({
      group: v.string(),
      items: v.string(),
    })),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data)
  },
})
