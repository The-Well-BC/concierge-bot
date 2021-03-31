const tables = require('../../config/tables');

const db = require('postgresorm');

const csv = require('csv-parser');
const fs =  require('fs');
const path = require('path');

const defaultFilterOrder = 'ORDER BY _id ASC';

class ArtistDAO {
    constructor() {
        this.useTestFile = false
    }

    artists = []

    resetArtists() {
        this.artists = [];
    }

    fetchArtists(limit) {
        if(this.artists.length > 0)
            return this.artists;
        else {
            let filePath = (this.useTestFile === true) ? '../../tests/artists.csv' : "./artists.csv";

            return new Promise((resolve, reject) => {
                fs.createReadStream(path.resolve(__dirname, filePath))
                .pipe(csv())
                .on('data', row => {
                    let walletAddress = row['Wallet Address'];
                    this.artists.push({
                        name: row['Artist Name'],
                        bio: row['Bio'],
                        walletAddress
                    });
                })
                .on('end', () => {
                    if(limit)
                        resolve(this.artists.slice(0, limit));
                    else
                        resolve( this.artists );
                });
            });
        }
    }
}

module.exports = { ArtistDAO }
