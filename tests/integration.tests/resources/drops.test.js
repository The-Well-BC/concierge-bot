const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));
const expect = chai.expect;
const foundation = require('../../../components/nftTradingPlatforms/foundation');
const zora = require('../../../components/nftTradingPlatforms/zora');
const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');

const noUndefinedKeys = require('../../utils/noUndefinedKeys');

describe('Fetch drops', function() {
    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 220);

    let dropKeys = [ 'name', 'url', 'event', 'img', 'creator', 'platform', 'date' ];

    const checkKeys = function(item) {
        let conditions = typeof item.creator === 'object' && item.creator != null;
        conditions = conditions && typeof item.creator.name === 'string' && item.creator.name != '';

        return conditions;
    }

    const checkDates = function(item, time) {
        return ( new Date(item.date) >= time );
    }

    const noDuplicates = function(arr) {
        return arr.every( (item, index) => {
            let duplicates = false;
            for (let i = 0; i < arr.length; i++) {
                if(i != index) {
                    duplicates = ( (item.name == arr[i].name) && (item.creator.name == arr[i].creator.name) );
                }
            }

            return !duplicates;
        });
    }


    it('Fetch drops from foundation', function() {
        return foundation.fetchDrops( parseInt(startTime/1000), 4 )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.include.keys(...dropKeys);
            expect(res).to.not.have.lengthOf.above(4);
            expect(res).to.all.have.property('event', 'drop');
            expect(res, 'No Duplicate Drops').to.satisfy(noDuplicates);

            expect(res).to.all.satisfy( drops => noUndefinedKeys(drops, ['img']), 'No undefined proeprties');
            expect(res).to.all.satisfy(checkKeys, 'Check keys are defined properly');
            expect(res).to.all.satisfy(item => checkDates(item, startTime), 'All item dates should be newer than start time');
            expect(res).to.all.have.property('platform', 'foundation');
        });
    });

    it('Fetch drops from Nifty Gateway', function() {
        const limit = 3;
        startTime = new Date().setDate(now.getDate() - 8);

        return nifty.fetchDrops( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.include.keys(...dropKeys);
            expect(res).to.all.satisfy(item => checkDates(item, startTime), 'All item dates should be newer than start time');
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res, 'No Duplicate Drops').to.satisfy(noDuplicates);

            expect(res).to.all.satisfy(noUndefinedKeys, 'No undefined properties');
            expect(res).to.all.satisfy(checkKeys, 'Check keys are defined properly');
            expect(res).to.all.have.property('event', 'drop');
            expect(res).to.all.have.property('platform', 'nifty');
        });
    })

    it('Fetch drops from SuperRare', function() {
        const limit = 3;

        startTime = new Date().setDate(now.getDate() - 9);

        return superrare.fetchDrops( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.include.keys(...dropKeys);
            expect(res).to.all.satisfy(item => checkDates(item, startTime), 'All item dates should be newer than start time');
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res, 'No Duplicate Drops').to.satisfy(noDuplicates);

            expect(res).to.all.satisfy( drops => noUndefinedKeys(drops, ['img']), 'No undefined proeprties');
            expect(res).to.all.satisfy(checkKeys, 'Check keys are defined properly');
            expect(res).to.all.have.property('event', 'drop');
            expect(res).to.all.have.property('platform', 'superrare');
        });
    });

    it.skip('#dev Fetch drops from Zora', function() {
        const limit = 3;

        return zora.fetchDrops(startTime, limit)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.include.keys(...dropKeys);
            expect(res).to.all.satisfy(item => checkDates(item, startTime), 'All item dates should be newer than start time');
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('event', 'drop');
            expect(res, 'No Duplicate Drops').to.satisfy(noDuplicates);

            expect(res).to.all.satisfy( drops => noUndefinedKeys(drops, ['img']), 'No undefined proeprties');
            expect(res).to.all.satisfy(checkKeys, 'Check keys are defined properly');
            expect(res).to.all.have.property('platform', 'zora');
        });
    });
});
