const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const foundation = require('../../components/resources/foundation');

describe('Fetch drops from foundation', function() {
    it('#dev Fetch drops from foundation', function() {
        return foundation.fetchDrops()
        .then(res => {
            console.log('DROPS', res);
            let price0 = res[0].price;
            expect(price0).to.be.a('string');
            expect(price0.length - price0.indexOf('.')).to.equal(3);
            expect(res).to.all.have.keys('date', 'name', 'price', 'service');
        });
    });
});
