import projects from "./hp2ProjectData";

interface BlogPosts {
    id: number;
    title: string;
    imageUrl: string;
    date: Date;
}

export const projectposts: BlogPosts[] = [
    {
        id: projects[0].id,
        title: projects[0].name,
        imageUrl: projects[0].imageUrl,
        date: new Date("2024-03-25")
    },
    {
        id: projects[1].id,
        title: projects[1].name,
        imageUrl: projects[1].imageUrl,
        date: new Date("2024-03-25")
    },
    {
        id: projects[2].id,
        title: projects[2].name,
        imageUrl: projects[2].imageUrl,
        date: new Date("2024-03-25")
    },
]

export const codingposts: BlogPosts[] = [
    {
        id: 1,
        title: "Coding Projects",
        imageUrl: "/coding.png",
        date: new Date("2024-03-25")
    }
]
