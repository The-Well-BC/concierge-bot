const expect = require('chai').expect;
const clone = require('rfdc')();
const command = require('../../components/commands');
const samplePayload = require('../samplePayload');
const subdao = require('../../components/daos/subscription.dao');

const markdown = require('../../components/messageFormats/markdownV2');
const plain = require('../../components/messageFormats/plain');

describe('The Subscribe Command', function() {
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Subscribe with no params', function() {
        const chatID = '1234';

        const payload = {
            command: { name: 'subscribe', },
            user: { username: 'Adesuwa' },
            chatID,
        }

        let promises = [
            command(payload, 'telegram', markdown),
            command(payload, 'twitter', plain)
        ]

        return Promise.all(promises)
        .then(message => {
            expect(message).to.all.have.property('text');
            expect(message).to.all.have.property('text', 'You have opted to receive notifications whenever any NFTs are traded or released.');

            return subdao.fetchSubscription(chatID)
        }).then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.deep.eql([
                { chatID, filters: [], messenger: 'telegram' },
                { chatID, filters: [], messenger: 'twitter' },
            ]);
        });
    });
    it('subscribe with one nft platform as params', function() {
        const chatID = '1234';

        const payload = {
            command: { name: 'subscribe', params: [ 'zora' ] },
            user: { username: 'Adesuwa' }, chatID,
        }

        let promises = [
            command(payload, 'telegram', markdown),
            command(payload, 'twitter', plain)
        ]

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.all.have.property('text', 'You have opted to receive notifications whenever any NFTs are traded or released on the following platforms: Zora.');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ platforms: ['zora']}], messenger: 'twitter' },
                { chatID, filters: [{ platforms: ['zora']}], messenger: 'telegram' }
            ]);
        });
    });

    it('subscribe with multiple nft platform as params', function() {
        const chatID = '1234';

        const payload = {
            command: { name: 'subscribe', params: [ 'zora', 'nifty', 'superrare' ] },
            user: { username: 'Adesuwa' }, chatID,
        }

        let promises = [
            command(payload, 'telegram', markdown),
            command(payload, 'twitter', plain)
        ]

        return Promise.all(promises)
        .then(res => {
            expect(res).to.all.have.property('text', 'You have opted to receive notifications whenever any NFTs are traded or released on the following platforms: Zora, Nifty Gateway, and SuperRare.');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.deep.members([
                { chatID, filters: [{ platforms: ['zora', 'nifty', 'superrare']}], messenger: 'telegram' },
                { chatID, filters: [{ platforms: ['zora', 'nifty', 'superrare']}], messenger: 'twitter' },
            ]);
        });
    });
});

