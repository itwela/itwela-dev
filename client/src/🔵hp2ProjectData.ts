import img1 from './assets/jkbg.png'
import img2 from './assets/jpmorgan.png'
import img3 from './assets/zantask1.png'
interface Project {
    id: string;
    status: string;
    content?: string;
    toolsUsed: Array<string>;
    name: string;
    description: any;
    imageUrl: string;
    projectLink: string;
    date: string;
}

const projects: Project[] = [
    {
        id: "k39s5hd",
        date: '2024',
        name: "JobKompass",
        description: "A full-stack web application that helps users gain key insights into their job search journey.",
        imageUrl: img1,
        content: `
# **SUMMARY**
JobKompass is a web and mobile-friendly application that helps users gain valuable insights into what's working for them in their job search. This project was born out of necessity because I needed something better than just a spreadsheet to keep up with all of my job applications. I needed a toolkit. A resource. Something to help me with cover letters, follow-up messages to people once I finished the job, etc. and that's what sparked the interest and development of this project.

Detailed breakdown coming soon.
                `,
        projectLink: "https://www.myjobkompass.com/",
        status: 'New',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Stripe ']
    },
    {
        id: "2i9f3jd",
        date: '2024',
        name: "Zentask",
        description: "A full-stack web application that helps users keep track of big to small tasks & projects in their life. \n This project is being built because of a coding workshop I'm attending to showcase my skills and land an interview with Cathie Stoscup (a connection I made on LinkedIn). ",
        imageUrl: img3,
        content: '',
        projectLink: "https://miro.com/app/board/uXjVNg5bmhE=/?share_link_id=246358243262",
        status: 'In Progress',
        toolsUsed: ['Next.js 14 ', 'PostgreSQL ', 'TailwindCSS ', 'Prisma ', 'Clerk Auth ', 'Material UI', 'Chakra UI' ],
    },
    {
        id: "r4h72w9",
        date: '2023',
        name: "Perspective",
        description: "A Jp Morgan library I worked on to help traders easily analyze vast amounts of data.", 
        imageUrl: img2,
        content: '',
        projectLink: "https://github.com/itwela/jpmorganchase.github.io",
        status: 'Completed',
        toolsUsed: ['Python ', 'React ', 'TypeScript ', 'Object-Oriented-Programming ']
    },
    // Add more projects as needed
];

export default projects;