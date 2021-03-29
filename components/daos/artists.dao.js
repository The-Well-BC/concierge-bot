const tables = require('../../config/tables');

const db = require('postgresorm');

const csv = require('csv-parser');
const fs =  require('fs');
const path = require('path');

const defaultFilterOrder = 'ORDER BY _id ASC';

module.exports = {
    fetchArtists() {
        let artists = [];
        let filePath = (process.env.NODE_ENV === 'test') ? '../../tests/artists.csv' : "./artists.csv";

        return new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(__dirname, filePath))
            .pipe(csv())
            .on('data', row => {
                let walletAddress = row['Wallet Address'];
                artists.push({
                    name: row['Artist Name'],
                    walletAddress
                });
            })
            .on('end', () => {
                resolve( artists );
            });
        });
    }
}
