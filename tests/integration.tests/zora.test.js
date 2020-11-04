const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const zora = require('../../components/resources/zora');


describe('Fetch drops from Zora', function() {
    this.timeout(20000);
    it('#dev Fetch drops from Zora', function() {
        let now = new Date();
        let startTime = new Date().setDate(now.getDate() - 1);
        return zora.fetchDrops(startTime)
        .then(res => {
            let price0 = res[0].price;
            let prices = res.map( d => d.price);
            console.log('DROPS', res[0].price);
            console.log('PRICE 0', res[0].price);
            let strippedPrices = res.map(d => parseFloat(d.price.substring(1)));
            console.log('stirpped pir',strippedPrices);

            expect(res).to.not.have.lengthOf(0);
            expect(price0[0]).to.equal('$');
            expect( strippedPrices ).to.all.be.a('number');
            expect(price0.length - price0.indexOf('.')).to.equal(3);
            expect(res[0]).to.have.property('service', 'zora');
            expect(res).to.all.have.keys('date', 'name', 'price', 'service', 'brand', 'img', 'action');
            // expect(res).to.all.have.keys('date', 'name', 'price', 'service', 'brand', 'img', 'action');
        });
    });
});
