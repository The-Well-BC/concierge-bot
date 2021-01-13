const chai = require('chai');
const expect = chai.expect;

const ethConverter = require('../../components/ethPrice');

describe('ETH TO USD converter', function() {
    it('Updates eth to usd price', function() {
        return ethConverter.updateEth()
        .then(res => {
            expect(res).to.equal(ethConverter.getEth());
            expect(ethConverter.getEth()).to.not.equal(5);
        });
    });
});
