import { query } from './_generated/server'

export const all = query({
  args: {},
  handler: async (ctx) => {
    const [cards, resume, music, playlists, photos, mailResponses, blogCategories, blogPosts] = await Promise.all([
      ctx.db.query('projects').withIndex('by_order').order('asc').collect(),
      ctx.db.query('resume').collect(),
      ctx.db.query('music').withIndex('by_order').order('asc').collect(),
      ctx.db.query('playlists').withIndex('by_order').order('asc').collect(),
      ctx.db.query('photos').collect(),
      ctx.db.query('mailResponses').withIndex('by_createdAt').order('desc').collect(),
      ctx.db.query('blogCategories').withIndex('by_order').order('asc').collect(),
      ctx.db.query('blogPosts').withIndex('by_order').order('asc').collect(),
    ])

    return {
      homescreenCards: {
        projects:     cards.filter(c => c.cardType === 'project'),
        roles:        cards.filter(c => c.cardType === 'role'),
        clients:      cards.filter(c => c.cardType === 'client'),
        achievements: cards.filter(c => c.cardType === 'achievement'),
        skills:       cards.filter(c => c.cardType === 'skill'),
        about:        cards.filter(c => c.cardType === 'about'),
        social:       cards.filter(c => c.cardType === 'social'),
      },
      resume: resume[0] ?? null,
      music: {
        tracks:    music,
        playlists: playlists,
      },
      photos: photos,
      mailResponses,
      blog: {
        categories: blogCategories,
        posts: blogPosts,
      },
    }
  },
})
