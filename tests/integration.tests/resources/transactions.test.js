const chai = require('chai').use(require('chai-things'));

chai.use(require('chai-subset'));
chai.use(
    require('../../helpers/noUndefinedKeys')
);
chai.use(
    require('./txAssert.js')
);
const expect = chai.expect;

const foundation = require('../../../components/nftTradingPlatforms/foundation');
const zora = require('../../../components/nftTradingPlatforms/zora');
const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');

describe('Fetch new transactions', function() {
    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 120);

    it('Fetch transactions from Foundation', function() {
        return foundation.fetchSales(parseInt(startTime/1000), 3)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys(['img']);

            expect(res, 'Nft Transaction test').to.all.be.nftTransaction(startTime);
            expect(res).to.all.have.property('platform', 'foundation');
        });
    });

    it('Fetch transactions from Nifty Gateway', function() {
        let startTime = new Date().setDate(now.getDate() - 120);

        return nifty.fetchSales(startTime, 100)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();

            expect(res, 'Nft Transaction test').to.all.be.nftTransaction(startTime);
            expect(res).to.all.have.property('platform', 'nifty');
        });
    });

    it('Fetch transactions from SuperRare', function() {
        return superrare.fetchSales(startTime, 3)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();

            expect(res, 'Nft Transaction test').to.all.be.nftTransaction(startTime);
            expect(res).to.all.have.property('platform', 'superrare');
        });
    });
});
