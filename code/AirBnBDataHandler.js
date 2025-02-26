/**
 * @module AirBnBDataHandler
 */
import fs from "fs/promises";
import { parse } from 'csv-parse/sync';
import { writeFile } from 'node:fs/promises';

/**
 * All functions to create a data handler.
 * @param {string} filePath 
 * @returns {object}
 */
export function AirBnBDataHandler(filePath) {
    let data = [];
    let filteredData = [];
    let avgPricePerRoom = [];
    let hostRankings = [];

    /**
     * Read and store the input file to data and make a copy as filteredData for further operation.
     * @returns {object}
     */
    async function loadFile() {
        return fs.readFile(filePath, 'utf8')
            .then(content => {
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

    /**
     * Filter data based on the input values.
     * @param {object} criteria 
     * @param {number} criteria.price
     * @param {number} criteria.accommodates
     * @param {number} criteria.review_scores_rating
     * @returns {object}
     */
    function filterListings(criteria) {
        filteredData = data.filter(item => 
            (criteria.price === undefined || parseFloat(item.price) >= criteria.price) &&
            (criteria.accommodates === undefined || parseInt(item.accommodates, 10) >= criteria.accommodates) &&
            (criteria.review_scores_rating === undefined || parseFloat(item.review_scores_rating) >= criteria.review_scores_rating)
        );
        return api;  // Allow method chaining
    }

    /**
     * Compute the average price per room for each listing fell into the filter.
     * @returns {object}
     */
    function computeStats() {
        const totalListings = filteredData.length;
        avgPricePerRoom = filteredData.map(item => {
            const rooms = parseInt(item.accommodates, 10) || 0;
            const price = parseFloat(item.price) || 0;

            return {
                id: item.id,
                totalPrice: price,
                roomNum: rooms,
                avgPricePerRoom: rooms > 0 ? (price / rooms).toFixed(2) : "N/A"
            };
        });

        console.log(`\nAfter filtering, ${totalListings} are found.`)
        console.log("\nAverage Price per Number of Rooms:", avgPricePerRoom);
        
        return api;  // Allow method chaining
    }

    /**
     * Compute the number of listings of every host fell into the filter and provide a ranking
     * @returns {object}
     */
    function computeHostRankings() {
        const hostCount = filteredData.reduce((acc, item) => {
            acc[item.host_id] = (acc[item.host_id] || 0) + 1;
            return acc;
        }, {});

        hostRankings = Object.entries(hostCount)
            .map(([host, count]) => ({ host, count }))  // Transform to pairs
            .sort((a, b) => b.count - a.count);  // Rank the host in a descending order

        const topTen = [...hostRankings].slice(0, 10);
        console.log("\nHost Rankings (Only Top 10 Shown):", topTen);
        return api;  // Allow method chaining
    }

    /**
     * Exports filtered data and computed statistics to a JSON file.
     * @async
     * @param {string} fileName
     * @returns {Promise<object>}
     */
    async function exportResults(fileName) {
        const results = {
            totalFilteredListings: filteredData.length,
            avgPricePerRoom,
            hostRankings,
            filteredData,
        };

        return writeFile(fileName, JSON.stringify(results, null, 2), 'utf8')
            .then(() => console.log(`Results exported to ${fileName}`))
            .then(() => api);  // Allow method chaining
    }

    /**
     * Get all the loaded data.
     * @returns {object}
     */
    function getData() {
        return data;
    }

    /**
     * Find the max price among all listings.
     * @param {object} listings 
     * @returns {number}
     */
    function findMaxPrice(listings) {
        return listings.reduce((max, item) => Math.max(max, item.price), 0);
    }

    const api = { loadFile, filterListings, computeStats, computeHostRankings, exportResults, getData, findMaxPrice };
    return api;
}



