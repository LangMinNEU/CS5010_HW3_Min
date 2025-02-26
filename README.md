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
<!-- [Watch on YouTube](link here) -->

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


### Usage 2


### Usage 3


### Usage 4


### Usage 5

