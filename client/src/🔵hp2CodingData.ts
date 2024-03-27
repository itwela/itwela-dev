import img1 from './assets/442-lc.png'
import img2 from './assets/ctci.png'

interface Leetcode {
    id: string;
    title: string;
    description?: string;
    content?: string;
    lcNum?: number;
    lcLink?: string;
    codesolution?: string;
    imageUrl: string;
    category: string;
}

const leetcode = "Leetcode & More"

const leetcodes: Leetcode[] = [
    {
        id: "v93jdf",
        title: "Why I'm reading Cracking the Coding Interview",
        category: leetcode,
        description: "I have been seeing this book everywhere!",        
        content: `
Recently I have decided to really "lock in" on Leetcoding and Hackerrank.
I have built the 
<a href="https://www.itwela.dev/slam">S.L.A.M</a>
tool to aid in this but I also am an avid reader.
In my spare time I have seen this book mentioned as very helpful 
and crucial in many engineers preperation for technical interviews.

On top of all of this, I recently attended a event hosted by Google called the 
"Intern Insider Night" where one engineer mentioned how helpful the book was to her.

If you are interested in reading the book or want to share any insights, send me a message
on 
<a href="https://www.linkedin.com/in/itwelai/">LinkedIn</a> 
or on 
<a href="https://twitter.com/itwelai">Twitter</a>!
I would love to talk to people about their experiences with this book and with technical interviews.


        `,
        imageUrl: img2,

    },
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
I recognize the efficiency of utilizing a single loop for all operations, yet I find it challenging to determine its speed accurately. While I understand that increased operations typically lead to slower performance, I still struggle to quantify this correlation. I am learning things like Big O notation to get more clear on this in the future.

**Space complexity:**  
Same as above.

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
        id: "2i9f3jd",
        title: "Zentask",
        content: '',
        imageUrl: img1,
        category: leetcode,
        date: new Date("2024-03-25")

        `,
        lcLink: "https://leetcode.com/problems/find-all-duplicates-in-an-array/solutions/4923106/python-solution-easy-to-me-at-least",
        imageUrl: img1,

    },
];

export default leetcodes;