import img1 from './assets/442-lc.png'

interface Leetcode {
    id: string;
    title: string;
    content?: string;
    lcNum?: number;
    imageUrl: string;
    category: string;
    date: Date;
}

const leetcode = "Leetcode & More"

const leetcodes: Leetcode[] = [
    {
        id: "7ghe58f",
        title: "Find All Duplicates in an Array",
        lcNum: 442,
        category: leetcode,
        imageUrl: img1,
        date: new Date("2024-03-25")

    }
];

export default leetcodes;