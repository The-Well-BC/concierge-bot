const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const zora = require('../../components/resources/zora');


describe('Fetch drops from Zora', function() {
    it('Fetch drops from Zora', function() {
        return zora.fetchDrops()
        .then(res => {
            expect(res).to.not.have.lengthOf(0);
            let price0 = res[0].price;
            expect(price0).to.be.a('string');
            expect(price0[0]).to.equal('$');
            expect(price0.length - price0.indexOf('.')).to.equal(3);
            expect(res[0]).to.have.property('service', 'zora');
            expect(res).to.all.have.keys('date', 'name', 'price', 'service', 'brand', 'img');
        });
    });
});
