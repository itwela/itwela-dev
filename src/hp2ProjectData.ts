// import img1 from './img1.png'

interface Project {
    id: number;
    status: string;
    toolsUsed: Array<string>;
    name: string;
    description: string;
    imageUrl: string;
    projectLink: string;
    date: string;
}

const projects: Project[] = [
    {
        id: 1,
        date: '2024',
        name: "JobKompass",
        description: "A web app that helps users gain key insights into their job search journey.",
        imageUrl: "https://example.com/project1.jpg",
        projectLink: "https://www.myjobkompass.com/",
        status: 'New',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Stripe ']
    },
    // Add more projects as needed
];

export default projects;