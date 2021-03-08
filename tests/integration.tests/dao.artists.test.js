const dao = require('../../components/daos/artists.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

const teardown = require('../teardown');

describe('Artist DAO', function() {
    beforeEach(() => teardown());

    it('Fetch all artists', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter = { platforms: ['zora', 'nifty'] };

        return dao.fetchArtists()
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.have.keys('name', 'platforms');

            expect(res).to.all.satisfy(i => {
                expect(i.platforms).to.have.keys('foundation', 'superrare', 'rarible', 'zora');
                return true;
            });
        });
    });
});
