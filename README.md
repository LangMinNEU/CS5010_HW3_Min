# CS5010 HW3 Functional Programming

## Summary
This is a simple application that reads CSV file and allows users to interact with it, including filtering and exporting results to another file.

A user can
1. filter the minimum price, minimum number of rooms (accommodates), and/or minimum review scores.
2. export the filtered result to another file of user's choice.
3. exit the program.
4. see the max price among all the listings. (Creative Addition)

Note that the program will automatically, based on the filter values, calculate 
1. the number of listings fall into the filter
2. average price per room for each listing
3. the number of total listings are there per host
4. provide a ranking of hosts by number of listings

## Author
Lang Min

## Working Files
- ./code/AirBnBDataHandler.js
- ./code/AirBnBReadline.js
- ./main.js
- ./listings.csv

Note that listings.csv is the input file.

## How to Run
```bash
node ./code/AirBnBReadline.js listings.csv
```

## Video
NEU CS5010 HW3 Video <br>
[Watch on YouTube](https://youtu.be/uNZ79XmCuGQ)

## Example & Counterexample
### Pure Function
```javascript
function findMaxPrice(listings) {
    return listings.reduce((max, item) => Math.max(max, item.price), 0);
}
```

### Counterexample of Pure Function
```javascript
let maxPriceGlobal = 0; // External variable
function findMaxPrice(listings) {
    maxPriceGlobal = listings.reduce((max, item) => Math.max(max, item.price), 0);
    return maxPriceGlobal;
}
```

### High-Order Function
```javascript
hostRankings = Object.entries(hostCount)
    .map(([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count);
```

### Counterexample of High-Order Function
```javascript
const hostEntries = Object.entries(hostCount);
const hostRankings = [];
for (let i = 0; i < hostEntries.length; i++) {
    const [host, count] = hostEntries[i];
    hostRankings.push({ host, count });
}
hostRankings.sort((a, b) => b.count - a.count);
```

## Creative Addition
I added a function findMaxPrice in AirBnBDataHandler.js file to help those who just won a lottery and try to show off. I also made a function getData to support the function findMaxPrice so that it can be a pure function. Now users can type 4 when the program asks them for input, and the max price will be displayed.

## Gen AI Usage
### Usage 1
I asked ChatGPT about ES Module, especially import and export. I studied and referred the answer. <br>
Prompt: <br>
I want to have a file for AirBnBDataHandler, a file for the readline UI, and any other files if needed. How do I manage import and export? <br>
Answer: <br>
1. AirBnBDataHandler.js – Handles data processing and filtering.
2. cli.js – Implements the Readline UI.
3. Other utility files can be added if necessary. 
Managing Imports & Exports: <br>
In AirBnBDataHandler.js, export the AirBnBDataHandler class and the loadListings function:
```javascript
export { AirBnBDataHandler, loadListings };
```
In cli.js, import those functions:
```javascript
import { AirBnBDataHandler, loadListings } from './AirBnBDataHandler.js';
```
Now, the script will correctly separate concerns, making it more modular and easier to maintain. Let me know if you need more refinements! 🚀

### Usage 2
I asked ChatGPT 4o how to achieve the method chaining. I referenced and modified its answer. <br>
Prompt: <br>
Suppose I want this work. <br>
handler.filterListings({ price: minPrice, number_of_rooms: minRooms, review_score: minReview }).computeStats().computeHostRankings(); <br>
Answer: <br>
To ensure method chaining works as expected in your AirBnBDataHandler.js, you need to modify the function implementations so that each method returns the handler itself (api). <br>
Modify AirBnBDataHandler.js for Method Chaining <br>
Update your methods to return api where necessary. <br>
```javascript
import fs from "fs/promises";
import { parse } from 'csv-parse/sync';
import { writeFile } from 'node:fs/promises';
export function AirBnBDataHandler(filePath) {
    let data = [];
    let filteredData = [];
    async function loadFile() {
        return fs.readFile(filePath, 'utf8')
            .then(content => {
                data = parse(content, { columns: true });
                filteredData = [...data];  // Ensure filtering does not modify original data
                return api;
            });
    }
    function filterListings(criteria) {
        filteredData = data.filter(item => 
            (criteria.price === undefined || parseFloat(item.price) >= criteria.price) &&
            (criteria.number_of_rooms === undefined || parseInt(item.number_of_rooms, 10) >= criteria.number_of_rooms) &&
            (criteria.review_score === undefined || parseFloat(item.review_score) >= criteria.review_score)
        );
        return api;  // Allow method chaining
    }
    function computeStats() {
        const totalListings = filteredData.length;
        const roomStats = filteredData.reduce((acc, item) => {
            const rooms = parseInt(item.number_of_rooms, 10) || 0;
            const price = parseFloat(item.price) || 0;
            if (rooms > 0) {
                acc.total[rooms] = (acc.total[rooms] || 0) + price;
                acc.count[rooms] = (acc.count[rooms] || 0) + 1;
            }
            return acc;
        }, { total: {}, count: {} });

        const avgPricePerRoom = Object.entries(roomStats.total).map(([rooms, totalPrice]) => ({
            rooms: Number(rooms),
            avgPrice: (totalPrice / roomStats.count[rooms]).toFixed(2)
        }));
        console.log(`Filtered Listings: ${totalListings}`);
        console.log("Average Price per Number of Rooms:", avgPricePerRoom);
        return api;  // Allow method chaining
    }
    function computeHostRankings() {
        const hostCount = filteredData.reduce((acc, item) => {
            acc[item.host_id] = (acc[item.host_id] || 0) + 1;
            return acc;
        }, {});

        const ranking = Object.entries(hostCount)
            .map(([host, count]) => ({ host, count }))
            .sort((a, b) => b.count - a.count);

        console.log("Host Rankings:", ranking);
        return api;  // Allow method chaining
    }
    async function exportResults(fileName) {
        const results = {
            totalListings: filteredData.length,
            filteredData,
            hostRankings: computeHostRankings()
        };

        return writeFile(fileName, JSON.stringify(results, null, 2), 'utf8')
            .then(() => console.log(`Results exported to ${fileName}`))
            .then(() => api);  // Allow method chaining
    }
    const api = { loadFile, filterListings, computeStats, computeHostRankings, exportResults };
    return api;
}
```

### Usage 3
I asked ChatGPT 4o how to handle the missing data in csv file. I studied and modified its reply. <br>
Prompt: <br>
What if there are missing data in csv file? <br>
Answer: <br>
✅ Fix: Ensure Proper Handling of Undefined Values Modify your filter function to handle missing values: <br>
```javascript
function filterListings(criteria) {
    filteredData = data.filter(item => {
        return (!criteria.price || (item.price && parseFloat(item.price) >= parseFloat(criteria.price))) &&
               (!criteria.number_of_rooms || (item.number_of_rooms && parseInt(item.number_of_rooms, 10) >= parseInt(criteria.number_of_rooms, 10))) &&
               (!criteria.review_score || (item.review_score && parseFloat(item.review_score) >= parseFloat(criteria.review_score)));
    });

    console.log(`Filtered results: ${filteredData.length} listings found.`);
    return api;
}
```

### Usage 4
I asked ChatGPT how to properly apply JSDoc to a functional programming file. I studied and simplified the answer it provided to me. <br>
Prompt: <br>
How to properly JSDoc a functional programming file? <br>
Answer: <br>
Documenting Pure Functions <br>
Since functional programming relies heavily on pure functions, clearly document parameters, return values, and possible exceptions. <br>
```javascript
/**
 * Sums up all numbers in an array.
 *
 * @function sum
 * @param {number[]} numbers - The array of numbers to sum up.
 * @returns {number} The sum of all numbers in the array.
 */
const sum = (numbers) => numbers.reduce((acc, num) => acc + num, 0);
```
Documenting Higher-Order Functions <br>
If a function takes another function as a parameter, specify the type using {Function} and use {callback} for more detail. <br>
```javascript
/**
 * Applies a transformation function to each element in an array.
 *
 * @function map
 * @param {Array} array - The array to map over.
 * @param {Function} transform - The transformation function.
 * @returns {Array} A new array with transformed elements.
 */
const map = (array, transform) => array.map(transform);
```


