import { AirBnBDataHandler } from './AirBnBDataHandler.js';
import { createInterface } from 'node:readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function startProgram() {
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

async function readlineUi(handler) {
    while (true) {
        console.log("\nOptions:");
        console.log("Enter 1 to start filtering");
        console.log("Enter 2 to export results");
        console.log("Enter 3 to exit");

        const choice = await askQuestion("\nEnter: ");

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
        else if (choice === "2") {
            const filename = await askQuestion("\nEnter filename: ");
            await handler.exportResults(filename, handler);
        } 
        else if (choice === "3") {
            console.log("\nSee you next time!\n");
            rl.close();
            process.exit(0);
        } 
        else {
            console.log("WARNING: Invalid choice. Please try again.");
        }
    }
}

startProgram();



