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
        let creatorIDs = res.map(i => i.walletAddress);

        creatorIDs = creatorIDs.filter(i => i != null && i != '')

        let ilimit = limit / platforms.length;

        return Promise.all( platforms.map((p, index) => {
            return p.fetchEvents(startTime, ilimit, creatorIDs)
        }))
    }).then(res => res.flat());
}
