const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));
const expect = chai.expect;
const foundation = require('../../../components/nftTradingPlatforms/foundation');
const zora = require('../../../components/nftTradingPlatforms/zora');
const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');

const noUndefinedKeys = require('../../utils/noUndefinedKeys');

const properties = ['name', 'url', 'stats', 'platform'];

describe('Fetch NFT creators', function() {
    describe('Sort by product count', function() {
        it('Foundation', function() {
            return foundation.fetchCreators()
            .then(res => {
                expect(res).to.all.have.keys( properties );
            });
        });
    });
});
