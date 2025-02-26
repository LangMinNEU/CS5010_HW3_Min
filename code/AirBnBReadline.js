import { AirBnBDataHandler } from './AirBnBDataHandler.js';
import { createInterface } from 'node:readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function startProgram() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.log("WARNING: Missing CSV file. Please provide a file path.");
        process.exit(1);
    }

    // Instantiate handler and load CSV file
    const handler = AirBnBDataHandler(filePath);
    
    try {
        await handler.loadFile();
        console.log(`Success! ${handler.computeStats().totalListings} listings read.`);
        await readlineUi(handler);
    } catch (err) {
        console.error(`Failure! Error loading file:`, err);
        process.exit(1);
    }
}

async function readlineUi(handler) {
    while (true) {
        console.log("\nOptions:");
        console.log("1. Start filtering");
        console.log("2. Export results");
        console.log("3. Exit");

        const choice = await askQuestion("Enter: ");

        if (choice === "1") {
            const minPrice = parseFloat(await askQuestion("Minimum price ($): ")) || 0;
            const minRooms = parseInt(await askQuestion("Minimum number of rooms: "), 10) || 0;
            const minReview = parseFloat(await askQuestion("Minimum review score (max 5.0): ")) || 0;

            console.log(`minPrice is ${minPrice}`);

            handler
            .filterListings({
                price: minPrice,
                accommodates: minRooms,
                review_scores_rating: minReview
            })
            .computeStats()
            .computeHostRankings();

            // const stats = handler.computeStats();
            // console.log(`Filtered results: ${stats.totalListings} listings found.`);
            // console.log("Average price per number of rooms:", stats.avgPricePerRoom);

            // console.log("Host ranking:", handler.computeHostRankings());
        } 
        else if (choice === "2") {
            const filename = await askQuestion("Enter filename: ");
            await handler.exportResults(filename, handler.computeStats());
        } 
        else if (choice === "3") {
            console.log("See you next time!\n");
            rl.close();
            process.exit(0);
        } 
        else {
            console.log("WARNING: Invalid choice. Please try again.\n");
        }
    }
}

startProgram();



