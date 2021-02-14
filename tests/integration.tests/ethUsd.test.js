const chai = require('chai');
const expect = chai.expect;

const ethConverter = require('../../components/ethPrice');

describe('ETH TO USD converter', function() {
    it('Updates eth and erc20s to usd price', function() {
        return ethConverter.updateEth()
        .then(res => {
            expect(res).to.eql(ethConverter.getPrices());
            expect(ethConverter.getEth()).to.not.equal(5);
            let prices = ethConverter.getPrices();
            expect(Object.values(prices)).to.all.not.equal(5);
        });
    });
});
