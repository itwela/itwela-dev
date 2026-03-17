import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

const CARD_TYPE_VALIDATOR = v.union(
  v.literal('project'),
  v.literal('achievement'),
  v.literal('role'),
  v.literal('skill'),
  v.literal('about'),
  v.literal('social'),
  v.literal('education'),
  v.literal('resume'),
  v.literal('client'),
)

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('projects').withIndex('by_order').order('asc').collect()
    return Promise.all(
      rows.map(async (row) => {
        if (!row.imageUrl) return row
        // If imageUrl looks like a Convex storage ID (no protocol), resolve it to a real URL
        const isStorageId = !row.imageUrl.startsWith('http')
        if (!isStorageId) return row
        const url = await ctx.storage.getUrl(row.imageUrl as any)
        return { ...row, imageUrl: url ?? row.imageUrl }
      })
    )
  },
})

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('featured'), true))
      .collect()
  },
})

export const clearAndSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('projects').collect()
    for (const row of all) {
      await ctx.db.delete(row._id)
    }

    const cards = [
      // ── PROJECTS ─────────────────────────────────────────────────────
      {
        cardType: 'project' as const,
        title: 'JobKompass',
        description: 'AI job tracker that writes your resume for you',
        longDescription:
          'Multi-tenant SaaS with an AI agent backed by 12 custom tools that auto-generates tailored resumes & cover letters, tracks applications, and coaches performance — cutting prep time by 50%+. Chrome extension parses live job listings in one click. Containerized LaTeX microservice on Railway for ATS-optimized PDFs. Stripe-gated subscription tiers enforced server-side via webhooks.',
        tags: ['Next.js', 'Convex', 'OpenAI Agents SDK', 'Stripe', 'LaTeX', 'Chrome Extension'],
        liveUrl: 'https://www.myjobkompass.com/',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 1,
      },
      {
        cardType: 'project' as const,
        title: 'Integrity',
        description: '$10K+ in digital product sales',
        longDescription:
          'End-to-end technical delivery for a multi-format digital product drop: React + Convex storefront, Stripe checkout with access provisioning, fulfillment mini-app that ingests carrier tracking numbers and automates shipment-status emails, an Apple-Music-style web player for secure on-site streaming, and the Lotus audiobook generation engine underneath it all. $10K+ gross sales, 100+ listeners.',
        tags: ['React', 'Convex', 'Stripe', 'Email Automation'],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 2,
      },
      {
        cardType: 'project' as const,
        title: 'Lotus',
        description: 'On the App Store now',
        longDescription:
          'My first iOS app — built over 11 months with React Native, Convex, and TypeScript. I had never shipped a mobile app before this. Lotus is an AI wellness app with an agent pipeline that orchestrates LLMs and multimodal generators for automated title, content, audio narration, and image creation. The narration from it was used in my father\'s audiobook. Contributed to five-figure revenue. Analyzing dozens of model cost/performance tradeoffs to stay profitable was a big part of the work.',
        tags: ['React Native', 'Convex', 'TypeScript', 'OpenAI', 'Replicate'],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 3,
      },
      {
        cardType: 'project' as const,
        title: 'CitySwipe',
        description: '200 users · 50K impressions',
        longDescription:
          'Led a team of 3 to build an AI travel planner with swipeable, LLM-powered destination recommendations backed by vector search. Won 1st place out of 300+ teams in a nationwide hackathon for innovation and product execution, then scaled to 200+ users and 50K+ impressions.',
        tags: ['Next.js', 'LangChain', 'Pinecone', 'Supabase'],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 5,
      },
      {
        cardType: 'project' as const,
        title: 'Jelly Up!',
        description: 'Auto-caption any video, instantly',
        longDescription:
          'Automated subtitle generation and burned-in captions using Whisper for ASR and OpenCV for frame alignment, producing both SRT and burned-in caption files. Frame-alignment heuristics and encoding automation for reliable demos. Placed 2nd at the Headstarter Hiring Hackathon.',
        tags: ['Next.js', 'Whisper', 'OpenCV', 'Docker', 'FFmpeg'],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 6,
      },
      {
        cardType: 'project' as const,
        title: 'Globetrotter AI',
        description: 'Voice-first travel planning',
        longDescription:
          'Voice-activated travel planner integrating speech recognition, LLM itinerary planning, third-party travel APIs, and Google TTS for spoken responses. Won 1st place at the Headstarter Hiring Hackathon for voice UX, API integrations, and a production-ready demo.',
        tags: ['Flask', 'Python', 'OpenAI', 'Google TTS', 'React Three Fiber'],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 7,
      },

      // ── ACHIEVEMENTS ──────────────────────────────────────────────────
      {
        cardType: 'achievement' as const,
        title: '300+ Teams. We Won.',
        description: 'Headstarter AI Fellowship — Jul to Sep 2024. Three hackathons, three podium finishes. Led a team of 3, shipped 5 AI apps in 10 weeks, reached 200+ users.',
        longDescription:
          'During the Headstarter AI Fellowship I competed in three hackathons and podium\'d in every one. Won 1st place with CitySwipe (out of 300+ teams nationwide). Won 1st place again with Globetrotter AI at the Hiring Hackathon. Placed 2nd with Jelly Up! at a separate Hiring Hackathon. Alongside that, led a team of 3 and shipped 5 production AI web apps during the fellowship window using Next.js, LangChain, and Supabase.',
        highlights: [
          '1st place — CitySwipe, out of 300+ teams nationwide',
          '1st place — Globetrotter AI, Headstarter Hiring Hackathon',
          '2nd place — Jelly Up!, Headstarter Hiring Hackathon',
          'Led a team of 3 engineers',
          'Shipped 5 AI apps in 10 weeks',
          '200+ users, 50K+ impressions across projects',
        ],
        tags: ['Headstarter', 'Hackathon', 'Next.js', 'LangChain', 'Supabase'],
        featured: true,
        order: 4,
      },

      // ── ABOUT / SKILL / SOCIAL ───────────────────────────────────────
      {
        cardType: 'about' as const,
        title: 'Itwela Ibomu',
        description: 'Full-Stack Engineer & AI Builder',
        longDescription:
          "Hey, I'm Itwela. I build full-stack AI products that ship and actually get used. I started from zero — taught myself to code, won national hackathons, built apps that made real revenue, and landed roles doing it professionally. I'm studying Software Engineering at WGU while building in production. When I'm not coding I'm making music. Both feel the same to me — you're just constructing something from nothing.",
        tags: [],
        featured: true,
        order: 9,
      },
      {
        cardType: 'skill' as const,
        title: 'The Toolkit',
        description: 'What I build with',
        longDescription: '',
        tags: [
          'TypeScript', 'React', 'Next.js', 'React Native',
          'Node.js', 'Python', 'Convex', 'PostgreSQL',
          'OpenAI', 'LangChain', 'Replicate', 'Pinecone',
          'Stripe', 'Docker', 'Supabase', 'Tailwind CSS',
        ],
        featured: false,
        order: 10,
      },
      {
        cardType: 'social' as const,
        title: 'Find Me',
        description: 'links',
        longDescription: '',
        tags: [],
        links: [
          { name: 'GitHub', url: 'https://github.com/itwela', icon: 'github' },
          { name: 'LinkedIn', url: 'https://linkedin.com/in/itwela', icon: 'linkedin' },
          { name: 'Twitter', url: 'https://twitter.com/itwela_', icon: 'twitter' },
        ],
        featured: false,
        order: 11,
      },

      // ── ROLES ────────────────────────────────────────────────────────
      {
        cardType: 'role' as const,
        title: 'AI Engineer — Dope Marketing',
        description: 'My most recent role. Built internal AI tooling that replaced hours of manual research with minutes.',
        longDescription:
          'At Dope Marketing (Jul–Dec 2025) I built an internal AI platform that 3 managers now use daily to automate account research and data analysis. Created APIs that give agents instant access to millions of housing and client records. Delivered 3 production tools that became part of the standard workflow across departments.',
        company: 'Dope Marketing',
        period: 'Jul 2025 – Dec 2025',
        highlights: [
          'Built internal AI platform adopted by 3 managers',
          'APIs wired to millions of housing & client records',
          'Cut manual lookup time from hours to minutes',
          'Delivered 3 production tools used across departments',
        ],
        tags: ['AI Agents', 'Python', 'TypeScript', 'OpenAI', 'API Design'],
        featured: true,
        order: 8,
      },
    ]

    for (const card of cards) {
      await ctx.db.insert('projects', card)
    }
    return `seeded ${cards.length} cards`
  },
})

export const updateProject = mutation({
  args: {
    id: v.id('projects'),
    cardType: CARD_TYPE_VALIDATOR,
    title: v.string(),
    description: v.string(),
    longDescription: v.string(),
    tags: v.array(v.string()),
    body: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    period: v.optional(v.string()),
    links: v.optional(v.array(v.object({ name: v.string(), url: v.string(), icon: v.string() }))),
    imageUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data)
  },
})

export const createProject = mutation({
  args: {
    cardType: CARD_TYPE_VALIDATOR,
    title: v.string(),
    description: v.string(),
    longDescription: v.string(),
    tags: v.array(v.string()),
    body: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    period: v.optional(v.string()),
    links: v.optional(v.array(v.object({ name: v.string(), url: v.string(), icon: v.string() }))),
    imageUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projects', args)
  },
})

export const deleteProject = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const seedAllResumeData = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe roles, projects, skills, education, resume cards — keep about, social, achievement
    const all = await ctx.db.query('projects').collect()
    for (const row of all) {
      if (['role', 'project', 'skill', 'education', 'resume'].includes(row.cardType)) {
        await ctx.db.delete(row._id)
      }
    }

    const cards: Parameters<typeof ctx.db.insert<'projects'>>[1][] = [
      // ── RESUME HEADER ─────────────────────────────────────────────────
      {
        cardType: 'resume',
        title: 'Itwela Ibomu',
        description: 'US Citizen',
        longDescription: '',
        body: 'iibomu@wgu.edu',
        tags: [],
        links: [
          { name: 'LinkedIn', url: 'https://linkedin.com/in/itwela', icon: 'linkedin' },
          { name: 'GitHub', url: 'https://github.com/itwela', icon: 'github' },
        ],
        featured: false,
        order: 101,
      },

      // ── EDUCATION ─────────────────────────────────────────────────────
      {
        cardType: 'education',
        title: 'Western Governors University (WGU)',
        description: 'B.S. in Software Engineering',
        longDescription: 'Relevant coursework: Data Structures & Algorithms · Python · Front-End Web Development · JavaScript',
        company: 'Salt Lake City, UT',
        period: 'December 2026 (Estimated)',
        tags: [],
        featured: false,
        order: 100,
      },

      // ── ROLES ─────────────────────────────────────────────────────────
      {
        cardType: 'role',
        title: 'AI Engineer',
        description: 'Built internal AI tooling that replaced hours of manual research with minutes.',
        longDescription: 'Built an internal AI platform used by 3 managers to automate account research and data analysis. Created APIs granting agents instant access to millions of housing and client records. Delivered 3 production tools adopted by management, enhancing research efficiency across departments.',
        company: 'Dope Marketing',
        period: 'Jul 2025 – Dec 2025',
        highlights: [
          'Built internal AI platform used by 3 managers to automate account research and data analysis.',
          'Created APIs granting agents instant access to millions of housing and client records, cutting manual lookup time from hours to minutes.',
          'Delivered 3 production tools adopted by management, enhancing research efficiency across departments.',
        ],
        tags: ['AI Agents', 'Python', 'TypeScript', 'OpenAI', 'API Design'],
        featured: true,
        order: 8,
      },
      {
        cardType: 'role',
        title: 'Software Engineering Fellow',
        description: 'Three hackathons, three podium finishes. Shipped 5 AI apps in 10 weeks.',
        longDescription: 'Led a team of 3 to build CitySwipe, an AI vacation planner with 200 users and 50K+ impressions. Won 1st place out of 300+ teams in a nationwide hackathon for innovation and product execution. Shipped 5 AI web apps using Next.js, LangChain, and Supabase; scaled multiple to 200+ users.',
        company: 'Headstarter',
        period: 'Jul 2024 – Sep 2024',
        highlights: [
          'Led a team of 3 to build CitySwipe, an AI vacation planner with 200 users and 50K+ impressions.',
          'Won 1st place out of 300+ teams in a nationwide hackathon for innovation and product execution.',
          'Shipped 5 AI web apps using Next.js, LangChain, and Supabase; scaled multiple to 200+ users.',
        ],
        tags: ['Next.js', 'LangChain', 'Supabase', 'OpenAI'],
        featured: true,
        order: 9,
      },
      {
        cardType: 'role',
        title: 'AI Engineer',
        description: 'Reduced captioning error rates and automated QA across 200 videos/day.',
        longDescription: 'Reduced captioning error rates by 20% across 200 videos/day through workflow optimization. Improved data processing consistency and automated recurring QA checks for higher reliability.',
        company: 'Dataforce',
        period: 'Apr 2024 – Jun 2024',
        highlights: [
          'Reduced captioning error rates by 20% across 200 videos/day through workflow optimization.',
          'Improved data processing consistency and automated recurring QA checks for higher reliability.',
        ],
        tags: ['Python', 'Data Processing', 'Automation', 'QA'],
        featured: false,
        order: 10,
      },

      // ── PROJECTS ──────────────────────────────────────────────────────
      {
        cardType: 'project',
        title: 'Integrity',
        description: '$10K+ in digital product sales — audiobook, album & fragrance storefront',
        longDescription: 'End-to-end technical delivery for a multi-format digital product drop: React + Convex storefront, Stripe checkout with access provisioning, and a fulfillment mini-app that ingests carrier tracking numbers and automates shipment-status emails. Also built "Lotus," a custom audiobook generation app, and an Apple-Music-style web player for secure on-site streaming. Enabled $10K+ in gross sales and supported 100+ listeners at launch.',
        tags: ['React', 'Convex', 'Stripe', 'Authentication', 'Email Automation'],
        highlights: [
          'Led end-to-end technical delivery for Integrity by building a React + Convex storefront and Stripe checkout/access provisioning that enabled $10K+ gross sales and supported 100+ listeners.',
          'Architected and built "Lotus," a custom audiobook generation app, and an Apple-Music-style web player to provide secure, on-site streaming and seamless digital delivery.',
          'Developed a fulfillment mini-app to ingest carrier tracking numbers, automate shipment-status emails, and centralize order management.',
        ],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 2,
      },
      {
        cardType: 'project',
        title: 'Lotus',
        description: 'iOS AI wellness app — narrated audiobooks, five-figure revenue',
        longDescription: 'iOS app with an API-driven agent pipeline orchestrating LLMs and multimodal generators for automated title, content, audio narration, and image creation — all while enforcing content and ethical guidelines. Produced the audiobook narration used by my father, packaged audio + book bundles, and contributed to five-figure revenue from album and book sales.',
        tags: ['React Native', 'Replicate', 'OpenAI', 'Convex'],
        highlights: [
          'Built an iOS app with an API-driven agent pipeline to orchestrate LLMs and multimodal generators for automated title, content, audio narration, and image generation while enforcing content and ethical guidelines.',
          'Produced audiobook narration used by my father; packaged audio + book bundles and generated five-figure revenue from album and book sales.',
          'Developed a monetization and pricing strategy by analyzing dozens of model cost/performance tradeoffs to ensure profitable unit economics.',
        ],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 3,
      },
      {
        cardType: 'project',
        title: 'JobKompass',
        description: 'AI job tracker that writes your resume for you',
        longDescription: 'Multi-tenant SaaS with an AI agent backed by 12 custom tools that auto-generates tailored resumes & cover letters, tracks applications, and coaches your performance — cutting end-to-end prep time by 50%+. Includes a Chrome extension that parses any live job listing in one click, a containerized LaTeX microservice on Railway for ATS-optimized PDFs, and Stripe-gated subscription tiers enforced server-side via webhooks.',
        tags: ['Next.js', 'React', 'Convex', 'OpenAI Agents SDK', 'Stripe', 'LaTeX'],
        highlights: [
          'Engineered a multi-tenant SaaS platform with an AI agent backed by 12 custom tools that autonomously generates tailored resumes and cover letters, tracks job applications, and delivers AI-coached performance analytics — reducing end-to-end prep time by 50%+.',
          'Architected a document generation pipeline integrating OpenAI GPT models with a containerized LaTeX microservice on Railway to produce ATS-optimized PDFs, with subscription-gated usage enforced server-side via Stripe webhooks.',
          'Built a Chrome extension with API-key authentication that parses live job listings from any webpage using a multi-provider LLM fallback strategy, automatically extracting structured data into the user\'s job tracker in one click.',
        ],
        liveUrl: 'https://www.myjobkompass.com/',
        githubUrl: 'https://github.com/itwela',
        featured: true,
        order: 1,
      },
      {
        cardType: 'project',
        title: 'Jelly Up!',
        description: '2nd place at Headstarter Hackathon — instant video caption generator',
        longDescription: 'Automated subtitle generation and burned-in captions using Whisper for ASR and OpenCV for frame alignment, producing both SRT and burned-in caption files. Placed 2nd at the Headstarter Hiring Hackathon.',
        tags: ['Next.js', 'Whisper', 'OpenCV', 'Docker', 'FFmpeg'],
        highlights: [
          'Automated subtitles and burned-in captions with Whisper and OpenCV; judged 2nd place at Headstarter Hiring Hackathon.',
          'Architected an end-to-end automated captioning pipeline using Whisper for ASR and OpenCV for frame alignment, producing both SRT and burned-in captions.',
          'Improved caption sync and robustness by implementing frame-alignment heuristics and encoding automation for reliable demos.',
        ],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 5,
      },
      {
        cardType: 'project',
        title: 'CitySwipe',
        description: '200 users, 50K impressions — AI vacation planner built in a week',
        longDescription: 'Led a team of 3 to build an AI travel planner with swipeable, LLM-powered destination recommendations backed by vector search for context-aware suggestions. Won 1st place out of 300+ teams in a nationwide hackathon, then scaled to 200+ users and 50K+ impressions.',
        tags: ['Next.js', 'LangChain', 'Pinecone', 'Supabase'],
        highlights: [
          'Personalized travel recommendations via LLM + vector search.',
          'Designed personalized travel recommendation flows using LLMs plus vector search for context-aware suggestions; reached 200+ users and 50K+ impressions.',
        ],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 6,
      },
      {
        cardType: 'project',
        title: 'Globetrotter AI',
        description: 'Voice travel assistant — 1st place at Headstarter Hackathon',
        longDescription: 'Voice-activated travel planner integrating speech recognition, LLM itinerary planning, third-party travel APIs, and Google TTS for spoken responses. Won 1st place at the Headstarter Hiring Hackathon.',
        tags: ['Flask', 'Python', 'OpenAI', 'Google TTS', 'React Three Fiber'],
        highlights: [
          'Voice-activated travel planner integrating speech recognition and travel APIs.',
          'Built a voice-activated travel assistant integrating speech recognition, LLM planning, and third-party travel APIs to produce itinerary suggestions and spoken responses.',
          'Won 1st place at the Headstarter Hiring Hackathon for voice UX, API integrations, and production-ready demo.',
        ],
        liveUrl: '',
        githubUrl: 'https://github.com/itwela',
        featured: false,
        order: 7,
      },

      // ── SKILLS ────────────────────────────────────────────────────────
      {
        cardType: 'skill',
        title: 'Languages & Frameworks',
        description: 'Core technical stack',
        longDescription: '',
        tags: ['TypeScript', 'Python', 'React', 'Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Supabase', 'Docker', 'Pinecone', 'OpenAI', 'Convex', 'Replicate', 'LangChain', 'LangGraph'],
        featured: false,
        order: 11,
      },
      {
        cardType: 'skill',
        title: 'Additional Skills',
        description: 'Practices & methodologies',
        longDescription: '',
        tags: ['Prompt Engineering', 'RAG / Vector Search', 'API Design', 'Product Development', 'UI/UX Design', 'Agile', 'Leadership', 'SDLC', 'Object Oriented Programming'],
        featured: false,
        order: 12,
      },
    ]

    for (const card of cards) {
      await ctx.db.insert('projects', card as any)
    }
    return `seeded ${cards.length} cards`
  },
})

export const seedResume = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('projects').collect()
    for (const row of existing.filter(r => r.cardType === 'resume')) {
      await ctx.db.delete(row._id)
    }
    await ctx.db.insert('projects', {
      cardType: 'resume',
      title: 'Itwela Ibomu',
      description: 'US Citizen',
      longDescription: '',
      body: 'iibomu@wgu.edu',
      tags: [],
      links: [
        { name: 'LinkedIn', url: 'https://linkedin.com/in/itwela', icon: 'linkedin' },
        { name: 'GitHub', url: 'https://github.com/itwela', icon: 'github' },
      ],
      featured: false,
      order: 101,
    })
    return 'resume card seeded'
  },
})

export const seedEducation = mutation({
  args: {},
  handler: async (ctx) => {
    // Remove any existing education cards first
    const existing = await ctx.db.query('projects').collect()
    for (const row of existing.filter(r => r.cardType === 'education')) {
      await ctx.db.delete(row._id)
    }
    await ctx.db.insert('projects', {
      cardType: 'education',
      title: 'Western Governors University (WGU)',
      description: 'B.S. in Software Engineering',
      longDescription: 'Relevant coursework: Data Structures & Algorithms · Python · Front-End Web Development · JavaScript',
      company: 'Salt Lake City, UT',
      period: 'December 2026 (Estimated)',
      tags: [],
      featured: false,
      order: 100,
    })
    return 'education seeded'
  },
})
