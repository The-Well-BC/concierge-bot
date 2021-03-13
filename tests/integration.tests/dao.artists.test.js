const dao = require('../../components/daos/artists.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

const teardown = require('../teardown');

describe('#dev Artist DAO', function() {
    beforeEach(() => teardown());

    it('Fetch all artists', function() {
        const chatid = "123456";
        const messenger = 'twitter';

        return dao.fetchArtists()
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.all.have.keys('name', 'walletAddress');

            expect(res).to.all.satisfy(i => {
                if(i.walletAddress) {
                    expect(i.walletAddress).has.lengthOf.above(25);
                }
                return true;
            });
        });
    });
});
