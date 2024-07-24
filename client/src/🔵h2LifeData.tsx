import img1 from './assets/headstarter-img.png'
interface LifeBlogPostInterface {
    id: string;
    status: string;
    content?: string;
    category: string;
    toolsUsed: Array<string>;
    name: string;
    description: any;
    imageUrl: string;
    projectLink: string;
    date: string;
    slamsummary?: string;
}

const life: LifeBlogPostInterface[] = [
    // Headstarter
    {
        id: "i-got-into-headstarter-hjk435h4",
        date: '2024',
        name: "Interning at HeadStarter",
        description: "I got my first Software Engineering Internship at Headstarter!!",
        imageUrl: img1,
        slamsummary: '',
        category: 'Life',
        content: `
# **Software Engineering Fellow? Me?**
As of today (7/24/2024), I am a Software Engineering Intern at HeadStarter. 
It's been a great experience so far, and I'm excited to see where I'll be in the future.

I applied to Headstarter for a previous internship and did not make it, so I made sure to
apply this time as soon as I got the email from Yasin that he was doing another program.
So if I could say how did I get this internship, I would say me creating JobKompass was a
contributing factor. It allowed me to get in the habit of applying to internships and jobs
already, I got into the habit of improving my resumes constantly, and truthfully I think the
preparation just met the opportunity.

So far I am already seeing the benefits of preparation since our first project in the program is a portfolio site! I
decided to take the time to really polish the one I have currently. I already have my custom 
domains and I love vercel so everything has been deployed already. Now with the polish on things,
in the future I want to show more of my artistic side on my portfolio and add more of the Leetcode 
problems I have been doing. I have started the Leetcode 75 and I have a pretty hefty goal of 2 problems a day.


                `,
        projectLink: "",
        status: 'New',
        toolsUsed: ['']
    },
    // Add more projects as needed
];

export default life;