const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));

chai.use(require('../../helpers/noUndefinedKeys'));
chai.use(require('./assert.nftEvent.js'));

const expect = chai.expect;

const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');
const foundation = require('../../../components/nftTradingPlatforms/foundation');
const zora = require('../../../components/nftTradingPlatforms/zora');

const nftFn = require('../../../components/nftTradingPlatforms');

const artistDAO = require('../../../components/daos/artists.dao');
let creators = {};

describe('Fetch NFT events', function() {
    this.timeout(25000);

    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 30);

    const platformArr = ['nifty', 'superrare', 'foundation', 'zora'];

    before(() => {
        return artistDAO.fetchArtists()
        .then(res => {
            creators = res.filter(i => i.walletAddress != '').map(i => i.walletAddress);
        });
    });

    it('#dev Fetch all events', function() {
        const limit = 15;

        return nftFn(startTime).fetchEvents( limit )
        .then(res => {
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime, creators);

            expect(res).to.not.have.lengthOf.above(limit);

            expect(res).to.satisfy(arr => {
                expect(
                    arr.some(i => i.platform === 'superrare' ),
                    'At least one SuperRare item'
                ).to.be.true;
                expect(
                    arr.some(i => i.platform === 'foundation'),
                    'At least one Foundation item'
                ).to.be.true;
                expect(
                    arr.some(i => i.platform === 'zora'),
                    'At least one Zora item'
                ).to.be.true;

                return arr.every(i => {
                    expect(platformArr).to.include(i.platform);
                    return true;
                });
            });
        });
    });

    it('Fetch from Foundation', function() {
        const limit = 30;
        let fndStart = new Date().setDate(now.getDate() - 90);

        return foundation.fetchEvents(fndStart, limit, creators)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.have.property('platform', 'foundation');
        });
    })

    it('Fetch from Zora', function() {
        const limit = 15;

        return zora.fetchEvents(startTime, limit, creators )
        .then(res => {
            expect(res).to.not.be.empty.and.to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'zora');
        });
    })

    it('Fetch from SuperRare', function() {
        const limit = 15;

        return superrare.fetchEvents( startTime, limit, creators )
        .then(res => {
            console.log('RES', res);
            expect(res).to.not.be.empty;
            expect(res).to.all.have.property('platform', 'superrare');
        });
    });
});
