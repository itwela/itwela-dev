import img1 from './assets/jkbg.png'
import img2 from './assets/jpmorgan.png'
import img3 from './assets/zantask1.png'
interface Project {
    id: number;
    status: string;
    toolsUsed: Array<string>;
    name: string;
    description: any;
    imageUrl: string;
    projectLink: string;
    date: string;
}

const projects: Project[] = [
    {
        id: 1,
        date: '2024',
        name: "Zentask",
        description: "A full-stack web application that helps users keep track of big to small tasks & projects in their life. \n This project is being built because of a coding workshop I'm attending to showcase my skills and land an interview with Cathie Stoscup (a connection I made on LinkedIn) ",
        imageUrl: img3,
        projectLink: "https://miro.com/app/board/uXjVNg5bmhE=/?share_link_id=246358243262",
        status: 'In Progress',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Material UI', 'Chakra UI' ],
    },
    {
        id: 2,
        date: '2024',
        name: "JobKompass",
        description: "A full-stack web application that helps users gain key insights into their job search journey.",
        imageUrl: img1,
        projectLink: "https://www.myjobkompass.com/",
        status: 'New',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Stripe ']
    },
    {
        id: 3,
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