const creatorDAO = require('../daos/artists.dao');
const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');

module.exports = (startTime, limit = 10) => {
    if(!startTime)
        throw new Error('No start time specified');

    let platforms = [foundation, superrare, zora];

    let drops = [];

    return creatorDAO.fetchArtists()
    .then(res => {
        console.log('ARTISTS', res);
        let creatorIDs = res.map(i => i.walletAddress);

        console.log('CREATOR IDS', creatorIDs);
        creatorIDs = creatorIDs.filter(i => i != null && i != '')

        console.log('CREATORS NICELY SORTED', creatorIDs);

        return Promise.all( platforms.map((p, index) => {
            return p.fetchEvents(startTime, limit, creatorIDs)
        }))
    }).then(res => res.flat());
}
