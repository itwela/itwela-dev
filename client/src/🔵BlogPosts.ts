import projects from "./🔵hp2ProjectData";
import leetcodes from "./🔵hp2CodingData";

interface BlogPosts {
    id: string;
    title: string;
    lcNum?: number;
    description?: string;
    content?: string;
    lcLink?: string;
    platform?: string;
    slamsummary?: string;
    codesolution?: string;
    imageUrl: string;
    category: string;
    date: Date;
}

const pj = "Projects"

export const blogposts: BlogPosts[] = [
// PROJECTS -----------------------------
    
// JobKompass
    {
        id: projects[0].id,
        date: new Date("2024-03-25"),
        category: pj,
        title: projects[0].name,
        description: projects[0].description,
        content: projects[0].content,
        imageUrl: projects[0].imageUrl,
    },
    // Zentask
    {
        id: projects[1].id,
        date: new Date("2024-03-25"),
        category: pj,
        title: projects[1].name,
        description: projects[1].description,
        content: projects[1].content,
        imageUrl: projects[1].imageUrl,
    },
    // Perspective
    {
        id: projects[2].id,
        date: new Date("2024-03-25"),
        category: pj,
        title: projects[2].name,
        description: projects[2].description,
        content: projects[2].content,
        imageUrl: projects[2].imageUrl,
    },

    
// CODING -----------------------------------

    // jlkjs HackerRank 
    // 713 Subarray Product Less Than K
    {
        id: leetcodes[0].id,
        date: new Date('2024-03-27'),
        category: leetcodes[0].category,
        title: leetcodes[0].title,
        description: leetcodes[0].description,
        slamsummary: leetcodes[0].slamsummary,
        content: leetcodes[0].content,
        codesolution: leetcodes[0].codesolution,
        imageUrl: leetcodes[0].imageUrl,
        platform: leetcodes[0].platform,
        lcNum: leetcodes[0].lcNum,
        lcLink: leetcodes[0].lcLink,
    },
    // Why I'm reading Crack the Coding Interview
    {
        id: leetcodes[1].id,
        date: new Date("2024-03-26"),
        category: leetcodes[1].category,
        title: leetcodes[1].title,
        description: leetcodes[1].description,
        slamsummary: leetcodes[1].slamsummary,
        content: leetcodes[1].content,
        codesolution: leetcodes[1].codesolution,
        imageUrl: leetcodes[1].imageUrl,
        platform: leetcodes[1].platform,
        lcNum: leetcodes[1].lcNum,
        lcLink: leetcodes[1].lcLink,
    },
    // Find All Duplicates in an Array
    {
        id: leetcodes[2].id,
        date: new Date("2024-03-25"),
        category: leetcodes[2].category,
        title: leetcodes[2].title,
        description: leetcodes[2].description,
        slamsummary: leetcodes[2].slamsummary,
        content: leetcodes[2].content,
        codesolution: leetcodes[2].codesolution,
        imageUrl: leetcodes[2].imageUrl,
        platform: leetcodes[2].platform,
        lcNum: leetcodes[2].lcNum,
        lcLink: leetcodes[2].lcLink,
    }
]


