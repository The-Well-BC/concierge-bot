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

describe('Fetch NFT events', function() {
    this.timeout(15000);

    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 75);

    const platformArr = ['nifty', 'superrare', 'foundation', 'zora'];

    it('#dev Fetch all events', function() {
        const limit = 35;

        return nftFn(startTime).fetchEvents( limit )
        .then(res => {
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Event test').to.all.be.nftEvent(startTime);

            expect(res).to.satisfy(arr => {
                expect(arr.some(i => i.platform === 'nifty'),
                    'At least one Nifty Gateway i'
                ).to.be.true;
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

    it('#dev Fetch from Foundation', function() {
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

    it('Fetch from Zora', function() {
        const limit = 30;
        startTime = new Date().setDate(now.getDate() - 75);

        return zora.fetchEvents( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty.and.to.not.have.lengthOf.above(limit);

            expect(res).to.satisfy(arr => {
                return arr.some(item => item.event === 'drop');
            });

            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'zora');

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
