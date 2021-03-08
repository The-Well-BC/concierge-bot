const creatorDAO = require('../daos/artists.dao');
const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit = 10) => {
    if(!startTime)
        throw new Error('No start time specified');

    let platforms = [foundation, superrare, nifty, zora];

    let drops = [];

    return creatorDAO.fetchArtists()
    .then(res => {
        console.log('RES', res);
        let creatorIDs = [ res.map(i => i.platforms.foundation),
            res.map(i => i.platforms.zora),
            res.map(i => i.platforms.superrare),
            res.map(i => i.platforms.nifty)
        ]

        console.log('CREATORS NICELY SORTED', creatorIDs);

        return Promise.all( platforms.map((p, index) => {
            return p.fetchEvents(startTime, limit, creatorIDs[index])
        }))
    }).then(res => res.flat());
}
