'use client'

import { useEffect, useState } from 'react';

// Define your functional component
const CodeReview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [codeInput, setCodeInput] = useState('// Write your code here\nconsole.log("Hello World!");');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Function to execute code and capture console logs
  const executeCode = () => {
    const newLogs: string[] = [];
    
    // Override console.log to capture output
    const originalLog = console.log;
    console.log = (...args) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      newLogs.push(`> ${logMessage}`);
      originalLog(...args);
    };
    
    try {
      // Execute the code
      eval(codeInput);
      setLogs(newLogs);
    } catch (error) {
      newLogs.push(`❌ Error: ${error}`);
      setLogs(newLogs);
    } finally {
      // Restore original console.log
      console.log = originalLog;
    }
  };
  
  // current interview prep section until i get something real
  // interview prep

  // # Start of Selection
  const codePrepDump = {
    reverseString: "",
    isPrime: false,
    factorial: 0,
    fibonacci: [] as number[],
    isPalindrome: false,
    functionsDump: [
      {
        name: "reverseString",
        description: "Reverse a string",
        code: `
function reverseString(str: string): string {
  return str.split('').reverse().join('');
}
  
  `},
      {
        name: "isPrime",
        description: "Check if a number is prime",
        code: `
function isPrime(num: number): boolean {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

  `},
      {
        name: "factorial",
        description: "Find the factorial of a number",
        code: `
function factorial(n: number): number {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

  `},
      {
        name: "fibonacci",
        description: "Find the Fibonacci sequence up to n terms",
        code: `
function fibonacci(n: number): number[] {
  const fibSeq = [0, 1];
  for (let i = 2; i < n; i++) {
    fibSeq[i] = fibSeq[i - 1] + fibSeq[i - 2];
  }
  return fibSeq.slice(0, n);
}

  `},
      {
        name: "isPalindrome",
        description: "Check if a string is a palindrome",
        code: `
function isPalindrome(str: string): boolean {
  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

`},
      {
        name: "lastNumberInArray",
        description: "Get last element of array",
        code: `
const lastNumberInArray = (arr: number[]): number => {
  return arr[arr.length - 1];
};

`},
      {
        name: "sliceArray", 
        description: "Slice array from start to end",
        code: `
const sliceArray = (arr: number[], start: number, end: number): number[] => {
  return arr.slice(start, end);
};

`},
      {
        name: "pushDataIntoObject",
        description: "Add key-value to object", 
        code: `
const pushDataIntoObject = (obj: any, key: string, value: any): void => {
  obj[key] = value;
};

`},
      {
        name: "getMaxValue",
        description: "Get maximum value in array",
        code: `
const getMaxValue = (arr: number[]): number => {
  return Math.max(...arr);
};

`},
      {
        name: "getMinValue",
        description: "Get minimum value in array",
        code: `
const getMinValue = (arr: number[]): number => {
  return Math.min(...arr);
};

`},
      {
        name: "findArrayPeaks",
        description: "Find peaks in array",
        code: `
const findArrayPeaks = (arr: number[]): { 
  topPeaks: number[], 
  bottomPeaks: number[] 
} => {
  return findPeaks(arr);
};

`},
      {
        name: "destructureObject",
        description: "Extract value from object",
        code: `
const destructureObject = (obj: any, key: string): any => {
  return obj[key];
};

`},
      {
        name: "loopThroughArray",
        description: "Loop through array with callback",
        code: `
const loopThroughArray = (arr: any[], callback: (item: any) => void): void => {
  arr.forEach(callback);
};

`},
      {
        name: "filterArray",
        description: "Filter array with condition",
        code: `
const filterArray = (arr: any[], condition: (item: any) => boolean): any[] => {
  return arr.filter(condition);
};

`},
      {
        name: "mapArray",
        description: "Transform array elements",
        code: `
const mapArray = (arr: any[], transform: (item: any) => any): any[] => {
  return arr.map(transform);
};

`},
      {
        name: "reduceArray",
        description: "Reduce array to single value",
        code: `
const reduceArray = (arr: any[], reducer: (acc: any, item: any) => any, initialValue: any): any => {
  return arr.reduce(reducer, initialValue);
};

`},
      {
        name: "sortArray",
        description: "Sort array numerically",
        code: `
const sortArray = (arr: number[]): number[] => {
  return arr.sort((a, b) => a - b);
};

`},
      {
        name: "findPeaks",
        description: "Find top and bottom peaks in array",
        code: `
function findPeaks(arr: number[]): { 
  topPeaks: number[], 
  bottomPeaks: number[] 
} {
  const topPeaks: number[] = [];
  const bottomPeaks: number[] = [];
  
  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] > arr[i - 1] + 5 && arr[i] > arr[i + 1] + 5) {
      topPeaks.push(arr[i]);
    }
    if (arr[i] < arr[i - 1] - 5 && arr[i] < arr[i + 1] - 5) {
      bottomPeaks.push(arr[i]);
    }
  }
  
  return { topPeaks, bottomPeaks };
}

`}
    ]
  };

  const array = [1, 2, 3, 4, 5];
  const lastNumber = array[array.length - 1];
  console.log(lastNumber);

  // slice an array for me from 0 to 4 - stops at 3
  const slicedArray = array.slice(0, 4);
  console.log(slicedArray);

  // slice an array for me from 1 to 4 - stops at 3
  const slicedArray2 = array.slice(1, 4);
  console.log(slicedArray2);

  // push some data into an object for me
  const object = { 
    people: [
      { name: "John", age: 30 }
    ]
  };
  object.people.push({ name: "Jane", age: 25 });

  console.log(object);

  // make a type to not think so hard
  interface Peak {
    id: number;
    height: number;
  }

  const peaks = {
    topPeaks: [
      {} as Peak
    ], 
    bottomPeaks: [
      {} as Peak
    ]
  }

  peaks.topPeaks.push({ id: 5, height: 9000})

  // show me how to get the max value in an array in typescript
  const numbers = [1, 2, 3, 4, 5];
  const max = Math.max(...numbers);
  console.log(max);

  // show me how to get the min value in an array in typescript
  const min = Math.min(...numbers);
  console.log(min);

  // Define a function named findPeaks that takes an array of numbers as input
  // and returns an object containing two arrays: topPeaks and bottomPeaks
  function findPeaks(arr: number[]): { topPeaks: number[], bottomPeaks: number[] } {
    const topPeaks: number[] = [];
    const bottomPeaks: number[] = [];
    
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i] > arr[i - 1] + 5 && arr[i] > arr[i + 1] + 5) {
        topPeaks.push(arr[i]);
      }
      if (arr[i] < arr[i - 1] - 5 && arr[i] < arr[i + 1] - 5) {
        bottomPeaks.push(arr[i]);
      }
    }
    
    return { topPeaks, bottomPeaks };
  }

  const sampleArray = [1, 3, 7, 1, 2, 6, 3, 2, 1];
  const { topPeaks, bottomPeaks } = findPeaks(sampleArray);
  console.log('Top Peaks:', topPeaks);
  console.log('Bottom Peaks:', bottomPeaks);

  // give me some go to methods for a interview in typescript
  // 1. how to find the last number in an array
  const lastNumberInArray = (arr: number[]): number => arr[arr.length - 1];

  // 2. how to slice an array
  const sliceArray = (arr: number[], start: number, end: number): number[] => arr.slice(start, end);

  // 3. how to push data into an object
  const pushDataIntoObject = (obj: any, key: string, value: any): void => {
    obj[key] = value;
  };

  // 4. how to get the max value in an array
  const getMaxValue = (arr: number[]): number => Math.max(...arr);

  // 5. how to get the min value in an array
  const getMinValue = (arr: number[]): number => Math.min(...arr);

  // 6. how to find peaks in an array
  const findArrayPeaks = (arr: number[]): { topPeaks: number[], bottomPeaks: number[] } => findPeaks(arr);

  // 7. how to destructure an object
  const destructureObject = (obj: any, key: string): any => obj[key];

  // 8. how to loop through an array
  const loopThroughArray = (arr: any[], callback: (item: any) => void): void => {
    arr.forEach(callback);
  };

  // 9. how to filter an array
  const filterArray = (arr: any[], condition: (item: any) => boolean): any[] => arr.filter(condition);

  // 10. how to map an array
  const mapArray = (arr: any[], transform: (item: any) => any): any[] => arr.map(transform);

  // 11. how to reduce an array
  const reduceArray = (arr: any[], reducer: (acc: any, item: any) => any, initialValue: any): any => arr.reduce(reducer, initialValue);

  // 12. how to sort an array
  const sortArray = (arr: number[]): number[] => arr.sort((a, b) => a - b);

  // Interview prep functions (needed for useEffect)
  function reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  function isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  function factorial(n: number): number {
    if (n === 0) return 1;
    return n * factorial(n - 1);
  }

  function fibonacci(n: number): number[] {
    const fibSeq = [0, 1];
    for (let i = 2; i < n; i++) {
      fibSeq[i] = fibSeq[i - 1] + fibSeq[i - 2];
    }
    return fibSeq.slice(0, n);
  }

  function isPalindrome(str: string): boolean {
    const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleanedStr === cleanedStr.split('').reverse().join('');
  }

  useEffect(() => {
    codePrepDump.reverseString = reverseString("hello");
    codePrepDump.isPrime = isPrime(7);
    codePrepDump.factorial = factorial(5);
    codePrepDump.fibonacci = fibonacci(10);
    codePrepDump.isPalindrome = isPalindrome("racecar");


    console.log(
      lastNumberInArray(array),
      loopThroughArray(array, (item) => console.log(item)),
      filterArray(array, (item) => item > 3),
      mapArray(array, (item) => item * 2),
      reduceArray(array, (acc, item) => acc + item, 0),
      sortArray(array),
      findPeaks(sampleArray),
      destructureObject(object, "people"),
      sliceArray(array, 0, 4),
      pushDataIntoObject(object, "people", { name: "Jane", age: 25 }),
      getMaxValue(numbers),
      getMinValue(numbers),
      findArrayPeaks(sampleArray),
      destructureObject(object, "people"),
      loopThroughArray(array, (item) => console.log(item)),
    )

    console.log(codePrepDump);
  }, []);

  // # End of Selection

  return (
    <div className='w-full h-full flex flex-col place-content-center place-items-center'>
      <h1>Code Prep</h1>
      
      {/* Code Editor and Console Panels */}
      <div className="mt-4 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Code Editor Panel */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">💻 Code Editor</h3>
              <button
                onClick={executeCode}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ▶️ Run Code
              </button>
            </div>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="w-full h-64 bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="// Write your code here..."
            />
          </div>
          
          {/* Console/Log Panel */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">📋 Console Output</h3>
              <button
                onClick={() => setLogs([])}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
              >
                🗑️ Clear
              </button>
            </div>
            <div className="w-full h-64 bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">
                  // Console output will appear here...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 rounded-lg max-w-5xl w-full">
        <h2 className="text-lg font-bold mb-2">Available Utility Functions:</h2>
        <p className="text-xs text-gray-600 mb-2">📋 Sorted alphabetically by function name</p>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <p className="text-xs text-gray-600 mb-2">
          Debug: {codePrepDump.functionsDump.filter(func => 
            func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.description.toLowerCase().includes(searchTerm.toLowerCase())
          ).length} functions found
        </p>
        
        <div className="space-y-6">
          {codePrepDump.functionsDump
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(func => 
              func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              func.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((func, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-2 text-lg">{func.name}</h3>
              <p className="text-sm text-gray-600 mb-3 italic">{func.description}</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{func.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
        
        {codePrepDump.functionsDump.filter(func => 
          func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          func.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <p>No functions found matching "{searchTerm}"</p>
            <p className="text-sm mt-2">Try searching by function name or description</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component
export default CodeReview; 