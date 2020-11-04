const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));
const expect = chai.expect;
const foundation = require('../../components/resources/foundation');

describe('#dev Fetch drops from foundation', function() {
    it('Fetch drops from foundation', function() {
        const now = new Date();
        let startTime = new Date().setDate(now.getDate() - 1);
        return foundation.fetchDrops( parseInt(startTime/1000) )
        .then(res => {
            console.log('DROPS', res);
            let price0 = res[0].price;
            expect(price0).to.be.a('string');
            expect(price0[0]).to.equal('$');
            expect(price0.length - price0.indexOf('.')).to.equal(3);
            expect(res[0]).to.have.property('service', 'foundation');
            expect(res).to.not.containSubset([{ name: undefined, }]);
            expect(res).to.not.containSubset([{ price: '$NAN' }]);
            expect(res).to.not.containSubset([{ action: undefined, status: undefined }]);
            expect(res).to.not.containSubset([{ action: null, status: null }]);

            expect(res).to.all.include.keys('date', 'name', 'price', 'service', 'brand', 'img', 'action');
        });
    });
});
