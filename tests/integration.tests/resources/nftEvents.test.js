const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));

chai.use(require('../../helpers/noUndefinedKeys'));
chai.use(require('./assert.nftEvent.js'));

const expect = chai.expect;

const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');

describe('#dev Fetch NFT events', function() {
    this.timeout(10000);

    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 220);

    it('Fetch from Nifty Gateway', function() {
        const limit = 15;
        startTime = new Date().setDate(now.getDate() - 8);

        return nifty.fetchEvents( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty.and.to.not.have.lengthOf.above(limit);
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'nifty');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);
        });
    })

    it('Fetch from SuperRare', function() {
        const limit = 15;

        startTime = new Date().setDate(now.getDate() - 9);

        return superrare.fetchEvents( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'superrare');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);
        });
    });
});
