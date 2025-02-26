import fs from "fs/promises";
import { parse } from 'csv-parse/sync';
import { writeFile } from 'node:fs/promises';

export function AirBnBDataHandler(filePath) {
    let data = [];
    let filteredData = [];
    let avgPricePerRoom = [];
    let hostRankings = [];

    async function loadFile() {
        return fs.readFile(filePath, 'utf8')
            .then(content => {
                // data = parse(content, { columns: true });
                data = parse(content, { columns: true }).map(item => ({
                    ...item,
                    price: item.price ? parseFloat(item.price.replace(/[$,]/g, '')) || 0 : 0,  // Remove $ and convert to number, default to 0
                    accommodates: item.accommodates ? parseInt(item.accommodates) || 0 : 0,  // Ensure it's a int, default to 0
                    review_scores_rating: item.review_scores_rating ? parseFloat(item.review_scores_rating) || 0 : 0  // Ensure it's a float, default to 0
                }));
                filteredData = [...data];  // Ensure filtering does not modify original data
                return api;
            });
    }

    function filterListings(criteria) {
        filteredData = data.filter(item => 
            (criteria.price === undefined || parseFloat(item.price) >= criteria.price) &&
            (criteria.accommodates === undefined || parseInt(item.accommodates, 10) >= criteria.accommodates) &&
            (criteria.review_scores_rating === undefined || parseFloat(item.review_scores_rating) >= criteria.review_scores_rating)
        );
        return api;  // Allow method chaining
    }

    function computeStats() {
        const totalListings = filteredData.length;
        avgPricePerRoom = filteredData.map(item => {
            const rooms = parseInt(item.accommodates, 10) || 0;
            const price = parseFloat(item.price) || 0;

            return {
                id: item.id,  // Keeping track of the listing ID
                totalPrice: price,  // Original price of the listing
                roomNum: rooms,
                avgPricePerRoom: rooms > 0 ? (price / rooms).toFixed(2) : "N/A"
            };
        });

        console.log(`\nAfter filtering, ${totalListings} are found.`)
        console.log("\nAverage Price per Number of Rooms:", avgPricePerRoom);
        
        return api;  // Allow method chaining
    }

    function computeHostRankings() {
        const hostCount = filteredData.reduce((acc, item) => {
            acc[item.host_id] = (acc[item.host_id] || 0) + 1;
            return acc;
        }, {});

        hostRankings = Object.entries(hostCount)
            .map(([host, count]) => ({ host, count }))
            .sort((a, b) => b.count - a.count);

        const topTen = [...hostRankings].slice(0, 10);
        console.log("\nHost Rankings (Only Top 10 Shown):", topTen);
        return api;  // Allow method chaining
    }

    async function exportResults(fileName) {
        const results = {
            totalFilteredListings: filteredData.length,
            avgPricePerRoom,
            // filteredData,
            // hostRankings: computeHostRankings()
            hostRankings
        };

        return writeFile(fileName, JSON.stringify(results, null, 2), 'utf8')
            .then(() => console.log(`Results exported to ${fileName}`))
            .then(() => api);  // Allow method chaining
    }

    const api = { loadFile, filterListings, computeStats, computeHostRankings, exportResults };
    return api;
}



