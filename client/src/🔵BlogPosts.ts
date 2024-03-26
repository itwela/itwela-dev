import projects from "./🔵hp2ProjectData";
import leetcodes from "./🔵hp2CodingData";

interface BlogPosts {
    id: string;
    title: string;
    lcNum?: number;
    description?: string;
    content?: string;
    lcLink?: string;
    codesolution?: string;
    imageUrl: string;
    category: string;
    date: Date;
}

const pj = "Projects"

export const blogposts: BlogPosts[] = [
    {
        id: projects[0].id,
        title: projects[0].name,
        category: pj,
        description: projects[0].description,
        content: projects[0].content,
        imageUrl: projects[0].imageUrl,
        date: new Date("2024-03-25")
    },
    {
        id: projects[1].id,
        title: projects[1].name,
        category: pj,
        description: projects[1].description,
        content: projects[1].content,
        imageUrl: projects[1].imageUrl,
        date: new Date("2024-03-25")
    },
    {
        id: projects[2].id,
        title: projects[2].name,
        category: pj,
        description: projects[2].description,
        content: projects[2].content,
        imageUrl: projects[2].imageUrl,
        date: new Date("2024-03-25")
    },
    // CODING
    {
        id: leetcodes[0].id,
        title: leetcodes[0].title,
        lcNum: leetcodes[0].lcNum,
        lcLink: leetcodes[0].lcLink,
        content: leetcodes[0].content,
        codesolution: leetcodes[0].codesolution,
        category: leetcodes[0].category,
        imageUrl: leetcodes[0].imageUrl,
        date: new Date("2024-03-25")
    }   
]


