const tables = require('../../config/tables');

const db = require('postgresorm');

const csv = require('csv-parser');
const fs =  require('fs');
const path = require('path');

const defaultFilterOrder = 'ORDER BY _id ASC';

module.exports = {
    fetchArtists() {
        let artists = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(__dirname, "./artists.csv"))
            .pipe(csv())
            .on('data', row => {
                let {Zora, Rarible, Foundation, SuperRare} = row;

                let [zora, foundation, rarible, superrare] = [Zora, Rarible, Foundation, SuperRare].map(i => {
                    if(i == '')
                        return null;
                    else
                        return i.toLowerCase()

                });
                artists.push({
                    name: row['Artist Name'],
                    platforms: { zora, foundation, rarible, superrare }
                });
            })
            .on('end', () => {
                console.log('CSV file read successfully');
                resolve( artists );
            });
        });
    }
}
