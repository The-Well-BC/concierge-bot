const expect = require('chai').expect;
const clone = require('rfdc')();
const command = require('../../components/commands');
const samplePayload = require('../samplePayload');
const subdao = require('../../components/daos/subscription.dao');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']

const chatIDs = ['1234', '5673', '9102', '4567'];

describe.only('#dev The Unsubscribe Command', function() {
    const chatID = '1234';

    const payload = {
        command: { name: 'unsubscribe' },
        user: { username: 'Adesuwa' }, chatID,
    };

    let subPlatformText =  'Successfully added subscription filter: ';
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown()
        .then(() => {
            let promises = Array.apply(null, {length: 2}).map((a, i) => {
                payload.format = formats[i % 2];
                let messenger = messengers[ i % 2];
                let p = { ...payload, command: { name: 'subscribe' }};
                return command(p, messenger);
            });

            return Promise.all(promises)
            .then(message => subdao.fetchSubscription(chatID))
            .then(res => {
                expect(res).to.have.lengthOf(2);
                expect(res).to.have.deep.members([
                    { chatID, filters: [], messenger: 'telegram' },
                    { chatID, filters: [], messenger: 'twitter' },
                ]);
            });
        });
    });

    it('Unsubscribe after subscribing to multiple filters', function() {
        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(message => {
            expect(message).to.all.have.property('text');
            expect(message).to.all.have.property('text', 'You have been unsubscribed from all alerts.');
            return subdao.fetchSubscription(chatID)
        }).then(res => {
            expect(res).to.be.empty;
        });
    });
});
