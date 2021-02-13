const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));

chai.use(require('../../helpers/noUndefinedKeys'));
chai.use(require('./assert.nftEvent.js'));

const expect = chai.expect;

const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');
const foundation = require('../../../components/nftTradingPlatforms/foundation');

const nftFn = require('../../../components/nftTradingPlatforms');

describe('#dev Fetch NFT events', function() {
    this.timeout(15000);

    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 220);

    const platformArr = ['nifty', 'superrare'];

    it('Fetch all events', function() {
        const limit = 35;
        startTime = new Date().setDate(now.getDate() - 1);

        return nftFn(startTime).fetchEvents( limit )
        .then(res => {
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);

            expect(res).to.satisfy(arr => {
                let c1 = arr.some(item => {
                    return item.platform === 'nifty';
                });
                let c2 = arr.some(item => {
                    return item.platform === 'superrare';
                });

                expect(c1, 'At least one Nifty Gateway item').to.be.true;
                expect(c2, 'At least one SuperRare item').to.be.true;

                return arr.every(item => {
                    expect(platformArr).to.include(item.platform);
                    return true;
                });
            });
        });
    });

    it('Fetch from Nifty Gateway', function() {
        const limit = 30;
        startTime = new Date().setDate(now.getDate() - 1);

        return nifty.fetchEvents( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty.and.to.not.have.lengthOf.above(limit);
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'nifty');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);
        });
    })

    it('Fetch from Foundation', function() {
        const limit = 30;
        startTime = new Date().setDate(now.getDate() - 90);

        return foundation.fetchEvents( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty.and.to.not.have.lengthOf.above(limit);

            expect(res).to.satisfy(arr => {
                return arr.some(item => item.event === 'drop');
            });

            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'foundation');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);
        });
    })

    it('Fetch from SuperRare', function() {
        const limit = 53;

        startTime = new Date().setDate(now.getDate() - 1);

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
