const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const fetchDrops = require('../../components/resources/fetchDrops');

describe('Fetch drops', function() {
    it('Fetch dropsfrom both resources', function() {
        return fetchDrops('1 hour')
        .then(res => {
            expect(res).to.all.have.keys('date', 'name', 'price', 'service', 'brand', 'img', 'action');
        });
    });
});
