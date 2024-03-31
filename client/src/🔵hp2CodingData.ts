import img1 from './assets/lcpics/🟠442-lc.png'
import img2 from './assets/ctci.png'
import img3 from './assets/lcpics/🟠713-lc.png'
import img4 from './assets/lcpics/🟠28-lc.png'

interface Leetcode {
    id: string;
    title: string;
    description?: string;
    content?: string;
    lcNum?: number;
    lcLink?: string;
    platform?: string;
    slamsummary?: string;
    codesolution?: string;
    imageUrl: string;
    category: string;
}

const leetcode = "Leetcode & More"

const leetcodes: Leetcode[] = [
    
    // Find the Index of the First Occurrence in a String
    {
        id: "28-find-the-index-of-the-first-occurrence-in-a-string-nvcniwfw09w",
        title: "Find the Index of the First Occurrence in a String",
        lcNum: 28,
        platform: "Leetcode",
        description: 'Number 28',
        slamsummary: "",
        category: leetcode,
        content: `
Hello!

**Here is my solution to the Find the Index of the First Occurrence in a String Problem in Python.**

**Author:** itwela  
**Language:** Python3  
**Tags:** Python3  

# Intuition:  
I watched a video talking about two pointers so 
that was my intuition but I quickly realized 
that was wrong. Then I watched a neetcode video 
and from writing out and taking notes i actually 
understood the problem that way.

# Approach:  
my approach any any problem I do 
is to first understand the goal, 
the problem and to print log. by 
print logging i was able to verify 
that im looping through the range I 
want and why.

# Complexity
- Time complexity:
Big O (n * m)

- Space complexity:
O(1)

# Code: 
        `,
        codesolution: `
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:

        # my notes ---
        def notes():    

            # my range notes
            ''' 
            form what i understand we are subtrracting the length of needle so that we never go oout of bounds and also because all we need to do is return the first position of the match basically.
            '''

            # For loop notes
            ''' if the haystck starting from i 
            and ending at i plus the length of needle,
            DOES eeuql needle:
            '''

            # my print logging process to figure this out:
            '''
            while i like neetcode. i dont like how he writes his syntax. when im trying to understand something I need things organized and once I'm more comfortable then i can put everything on 1 line. He's tring to go fast and while speed is important I know i dont start fast. here are my print loggs:

            print("this is hastack:", haystack)
            print("this is needle:", needle)
            print("this is lenght of haystack plus 1:", n)
            print("thi sis length of needle:", m)
            print("thisis my range:", myrange)
        
            '''
            pass

        m = len(needle)
        n = len(haystack) + 1

        myrange = n - m

        if needle == "":
            return 0

        for i in range(myrange):
            if haystack[i: i + m] == needle:
                return i

        return -1
        `,
        lcLink: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/solutions/4949320/my-python-solution",
        imageUrl: img4,

    },

    // Subarray Product Less Than K
    {
        id: "713-subarray-product-less-than-k-8erhg9hergw",
        title: "Subarray Product Less Than K",
        lcNum: 713,
        platform: "Leetcode",
        description: 'Number 713',
        slamsummary: `
**S.L.A.M Summary I used to help me understand this problem:**

For this problem, we can use arrays as the main data structure to store and iterate through the given integers. 
The lexicon includes terms like contiguous subarrays and product, where understanding product involves multiplying elements together. 
One algorithm that can be used here is a sliding window approach to efficiently count subarrays with a product less than k. 
This problem involves math operations such as multiplication to calculate the product of elements in subarrays.
        `,
        category: leetcode,
        content: `
Before I write my solution, I want to document some things I learned this problem that I can refer to later:

**Contiguous** means are the elements in question in sequential order.
- For example: [3,4,5] IS contiguous.
- But [1,4,5] is not contiguous.

**Product** means the multiplication of elements in question.
- For example: [3,4,5] has product 3*4*5 = 60.

**Sliding Window** is very useful when dealing with subarrays or sub anything it could be strings as well.
- Subarray = Sliding Window Solution.
- You will always have a left and right boundary.
- The right boundary basically with keep going or expand until we hit some sort of limit we have set.
- Once that limit is set, the left boundary will start moving until it gets to where the right boundary is.
visually this would crate  sort of lagging effect where thr right goes first to scope out the left. scene and the left moves to where the right is after.

**What is /= ?**
- This means the answer will be whatever is to the **left** of the **" / "** divided by
whatever is to the **right** of the **" = "** sign.
- I used this in the solution to make the left part of the sliding window start!
- This was challenging for me so I will definitely do more of these until the pattern is more intuitive. 
The code is not long since this is my first sliding window problem I'm just getting familiar. 

**Here is my solution to the Subarray Product Less Than K Problem in Python.**

**Author:** itwela  
**Language:** Python3  
**Tags:** Array, Sliding Window  

# Intuition:  
This is my first problem involving the sliding window 
technique. Initially, I knew what I needed to do 
first: to get all of the subarrays and then find 
the products of them to see how many of those 
are less than k. I just didn't know how to do 
all of it, but I knew I would need to keep 
track of the product and how many arrays there 
are!

# Approach:  
Initially, I tried to make functions for getting the 
product and then for finding the sum, but after 
trying to brute force it unsuccessfully, I 
looked for how to implement the sliding window 
in this problem and forced myself to understand 
how it works. I used print logging to see each step, 
and now I have a much better understanding of how 
the sliding window technique works. I think after 
a few more of these, it won't take me as long and 
it will become more intuitive for me.

# Complexity
- Time complexity:
O(n)

- Space complexity:
O(1) 

# Code: 
        `,
        codesolution: `
class Solution:

        def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
            product = 1
            numOfSubArrays = 0
    
            '''
            this handles the case where no matter what,
            the elements in the array will
            be bigger than K.
    
            the only time that would be possible is if
            k is 1 or zero so we define that below.
            '''
    
            if k <= 1:
                return 0
            
            ''' Sliding window. You will have
            a left and right boundary
            '''
            left = 0
            right = 0
    
            ''' 
            this sets up the big picture.
            we need to look at each element in the array.
            while that is the case, we need the real loop 
            to take place inside of this condition we define here. 
            '''
    
            '''
            This is also big 0(n) because were only looping through the array
            as many times as it takes to get to the end of it :D 
            '''
    
            while right < len(nums):
                product *= nums[right]
                print("out product", product)
    
                while product >= k:
                    product /= nums[left]
                    print('in product', product)
                    left+=1
                    print("left -----------------------: ", left)
                    print("in num of subs:", numOfSubArrays)
    
                ''' using += allows us to update the value of the number of subarrays
                 so it like keeps track of what it was previously and just adds our
                 condition to whatever that value used to be
                 '''
                numOfSubArrays += right - left + 1
                print(f"number of arrays is:  {right} - {left} + 1")
                right+=1
                print(f"right is now {right}")
                print("the number of arrays is -----------------------: ", numOfSubArrays)
    
                
            return numOfSubArrays    
        `,
        lcLink: "https://leetcode.com/discuss/topic/4931713/sliding-window-solution-python/",
        imageUrl: img3,

    },

    // cracking the coding interview
    {
        id: "cracking-the-coding-interview-9bnsdjbks",
        title: "Why I'm reading Cracking the Coding Interview",
        category: leetcode,
        description: "I have been seeing this book everywhere!",        
        content: `
Recently I have decided to really "lock in" on Leetcoding and Hackerrank.
I have built the 
<a href="https://www.itwela.dev/slam">S.L.A.M</a>
tool to aid in this but I also am an avid reader.
In my spare time I have seen this book mentioned as very helpful 
and crucial in many engineers preparation for technical interviews.

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
    
    // Leetcode Find All Duplicates In an Array 442
    {
        id: "442-Find-All-Duplicates-in-an-Array-247hbvkjsd",
        title: "Find All Duplicates in an Array",
        lcNum: 442,
        platform: "Leetcode",
        description: 'Number 442',
        category: leetcode,
        slamsummary: ``,
        content: `
**Here is my solution to the Find All Duplicates in an Array Problem in Python.**

**Author:** itwela  
**Language:** Python3  
**Tags:** Array, Ordered Set  

# Intuition: 
My first thoughts were to use a set to basically get rid of everything that's not a duplicate and then just append what's left to a new array.  

# Approach:  
This is exactly what I ended up doing. I second guessed myself since this was a medium, I figured it can't be that easy but it actually was.  

# Complexity:
- Time complexity:  
I recognize the efficiency of utilizing a single loop for all operations, yet I find it challenging to determine its speed accurately. While I understand that increased operations typically lead to slower performance, I still struggle to quantify this correlation. I am learning things like Big O notation to get more clear on this in the future.

- Space complexity: 
Same as above.

# Code: 
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
        `,
        lcLink: "https://leetcode.com/problems/find-all-duplicates-in-an-array/solutions/4923106/python-solution-easy-to-me-at-least",
        imageUrl: img1,

    },
];

export default leetcodes;