/**
 * @module AirBnBReadline
 */
import { AirBnBDataHandler } from './AirBnBDataHandler.js';
import { createInterface } from 'node:readline';

/**
 * Creates a readline interface.
 * @constant
 */
const rl = createInterface({ input: process.stdin, output: process.stdout });

/**
 * Create a promise to ask user for inputs.
 * @param {string} query
 * @returns {Promise<string>}
 */
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Initializes the program and loads the CSV file.
 * @async
 * @throws {Error}
 */
async function startProgram() {
    // Check if the input file is passed as an argument
    const filePath = process.argv[2];
    if (!filePath) {
        throw new Error("WARNING: Missing CSV file. Please provide a file path.");
    }

    // Instantiate handler and load CSV file
    const handler = AirBnBDataHandler(filePath);
    try {
        await handler.loadFile();
        console.log(`Success! File loaded.`);
        await readlineUi(handler);
    } catch {
        throw new Error(`Failure! Error loading file.`);
    }
}

/**
 * Display the readline UI and ask for inputs.
 * @async
 * @param {object} handler 
 * @returns {void}
 */
async function readlineUi(handler) {
    while (true) {
        console.log("\nOptions:");
        console.log("Enter 1 to start filtering");
        console.log("Enter 2 to export results");
        console.log("Enter 3 to exit");
        console.log("* Enter 4 to see the max price");  // Creative addition

        const choice = await askQuestion("\nEnter: ");

        // To start filtering
        if (choice === "1") {
            const minPrice = parseFloat(await askQuestion("\nMinimum price ($): ")) || 0;
            const minRooms = parseInt(await askQuestion("Minimum number of rooms: "), 10) || 0;
            const minReview = parseFloat(await askQuestion("Minimum review score (max 5.0): ")) || 0;

            console.log("\n---------------Result Starts---------------");  // For test and clearer view
            await handler
            .filterListings({
                price: minPrice,
                accommodates: minRooms,
                review_scores_rating: minReview
            })
            .computeStats()
            .computeHostRankings();
            console.log("\n---------------End of Result---------------");  // For test and clearer view
        } 
        // To export results
        else if (choice === "2") {
            const filename = await askQuestion("\nEnter filename (for example, out.txt): ");
            await handler.exportResults(filename, handler);
        } 
        // To exit the program
        else if (choice === "3") {
            console.log("\nSee you next time!\n");
            rl.close();
            process.exit(0);
        } 
        // To see the max price
        else if (choice === "4") {
            const allData = handler.getData();
            const maxPrice = handler.findMaxPrice(allData);
            console.log(`\nAmong ${allData.length} listings, the max price is $${maxPrice}.`);
        }
        // Default
        else {
            console.log("WARNING: Invalid choice. Please try again.");
        }
    }
}

startProgram();



