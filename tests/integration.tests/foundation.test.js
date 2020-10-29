const chai = require('chai').use(require('chai-things'));
const expect = chai.expect;
const foundation = require('../../components/foundation');

describe('Fetch drops from foundation', function() {
    return foundation.fetchDrops()
    .then(res => {
        expect(res).to.all.have.keys('id', 'date');
    });
});
