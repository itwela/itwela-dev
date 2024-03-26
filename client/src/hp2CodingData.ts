import img1 from './assets/442-lc.png'

interface Leetcode {
    id: string;
    title: string;
    content?: string;
    lcNum?: number;
    lcLink?: string;
    codesolution?: string;
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
        content: `
### Welcome! 

### Here is my solution to the Find All Duplicates in an Array Problem in Python.

**Author:** itwela  
**Rating:** 2  
**Time:** 14 hours ago  
**Language:** Python3  
**Tags:** Array, Ordered Set  

**Intuition:**  
My first thoughts were to use a set to basically get rid of everything that's not a duplicate and then just append what's left to a new array.  

**Approach:**  
This is exactly what I ended up doing. I second guessed myself since this was a medium, I figured it can't be that easy but it actually was.  

**Complexity:**  
**Time complexity:**  
I know it's fast because I'm doing everything in one loop, but I still struggle to understand how to figure out HOW fast. I just know the more operations you do, the slower things get so if anyone can help me grasp that, please let me know in the comments!  

**Space complexity:**  

**Code:**  
        `,
        codesolution: `
class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        
        ea = []
        newset = set()

        for num in nums:
            if num not in newset:
                newset.add(num)
            else:
                ea.append(num)
        ans = ea
        return ea
\`\`\`

        `,
        lcLink: "https://leetcode.com/problems/find-all-duplicates-in-an-array/solutions/4923106/python-solution-easy-to-me-at-least",
        imageUrl: img1,
        date: new Date("2024-03-25")

    }
];

export default leetcodes;