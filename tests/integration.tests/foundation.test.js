const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const foundation = require('../../components/resources/foundation');

describe('Fetch drops from foundation', function() {
    it('Fetch drops from foundation', function() {
        return foundation.fetchDrops()
        .then(res => {
            console.log('DROPS', res);
            let price0 = res[0].price;
            expect(price0).to.be.a('string');
            expect(price0[0]).to.equal('$');
            expect(price0.length - price0.indexOf('.')).to.equal(3);
            expect(res[0]).to.have.property('service', 'foundation');
            expect(res).to.all.have.keys('date', 'name', 'price', 'service', 'brand', 'img');
        });
    });
});
