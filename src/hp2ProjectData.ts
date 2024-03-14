import img1 from './assets/jkbg.png'
import img2 from './assets/jpmorgan.png'

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
        description: "A full-stack web application that helps users gain key insights into their job search journey.",
        imageUrl: img1,
        projectLink: "https://www.myjobkompass.com/",
        status: 'New',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Stripe ']
    },
    {
        id: 2,
        date: '2023',
        name: "Perspective",
        description: "A Jp Morgan library I worked on to help traders easily analyze vast amounts of data.", 
        imageUrl: img2,
        projectLink: "https://github.com/itwela/jpmorganchase.github.io",
        status: '',
        toolsUsed: ['Python ', 'React ', 'TypeScript ', 'Object-Oriented-Programming ']
    },
    // Add more projects as needed
];

export default projects;