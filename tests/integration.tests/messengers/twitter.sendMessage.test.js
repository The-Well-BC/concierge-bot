const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const twitter = require('../../../components/messenger/twitter');
const payload = require('../../twitterSamplePayload');
const chatID = payload.chatID;
const chatIDs = [payload.chatID,payload.chatID1];

describe('Twitter methods: Send Text Message', function() {
    it('Should send private message if one chatID is specified', function() {
        const message = {
            text: 'Succeeded in sending text only DM\n' + new Date()
        }

        let tweetid;

        return twitter.sendMessage(message, [chatID])
        .then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res).to.all.satisfy(item => {
                assert.property(item, 'event');
                assert.propertyVal(item.event, 'type', 'message_create');
                assert.property(item.event.message_create, 'message_data');
                assert.propertyVal(item.event.message_create.message_data, 'text', message.text);
                assert.propertyVal(item.event.message_create.target, 'recipient_id', chatID);

                return true;
            });
        });
    });

    it('Should send private messages if multiple user chatIDs are specified', function() {
        const message = {
            text: 'Succeeded in sending text only DM for multiple users\n' + new Date(),
        }

        let tweetid;

        return twitter.sendMessage(message, chatIDs)
        .then(res => {
            expect(res).to.have.lengthOf(2);

            expect(res).to.satisfy( arr => {
                return arr.every(item => {
                    assert.property(item, 'event');
                    assert.propertyVal(item.event, 'type', 'message_create');
                    assert.property(item.event.message_create, 'message_data');
                    assert.propertyVal(item.event.message_create.message_data, 'text', message.text);

                    return true;
                });

                let dm1 = arr.some(item => {
                    return (item.event.message_create.target.recipient_id === chatIDs[0]);
                });
                let dm2 = arr.some(item => {
                    return (item.event.message_create.target.recipient_id === chatIDs[1]);
                });

                return dm1 && dm2;
            });

        });
    });

    it('Should send private message and tweet if one of the chatIDs is \'all\' and the other are actual chat IDs', function() {
        const message = {
            text: 'Succeeded in sending text only DM for multiple users and one tweet\n' + new Date()
        }

        let tweetid;

        return twitter.sendMessage(message, [...chatIDs, 'all'])
        .then(res => {
            expect(res).to.have.lengthOf(3);

            expect(res).to.satisfy(arr => {
                let dms = arr.some(item => {
                    assert.property(item, 'event');

                    assert.propertyVal(item.event, 'type', 'message_create');
                    assert.property(item.event.message_create, 'message_data');
                    assert.propertyVal(item.event.message_create.message_data, 'text', message.text);

                    return true;
                });

                assert.isTrue(dms, 'Should have a few dm items' + arr);

                let dm1 =  arr.some(item => {
                    return item.event.message_create.target.recipient_id === chatIDs[0];
                });

                let dm2 = arr.some(item => {
                    return item.event.message_create.target.recipient_id === chatIDs[1];
                });

                if(!(dm1 && dm2)) {
                    assert.fail(
                        arr,
                        [{event: {message_create:{target:{recipient_id:chatIDs[0]}}} },
                            {event: {message_create:{target:{recipient_id: chatIDs[1]}}} }],
                        'Messages with recipient ids missing'
                    );
                }

                // Tweet
                let tweet = arr.some(item => {
                    let c1 = item.tweet && typeof item.tweet === 'object';
                    let c2 = false;
                    if(item.tweet)
                        c2 = item.tweet.text ===  message.text;

                    return c1 && c2;
                });

                if(!tweet) {
                    assert.fail(arr, [{tweet: {}}], 'Expected this to contain one tweet object');
                }

                return dms, dm1 && dm2 && tweet;
            });

            expect(res).to.satisfy(arr => {
                let c1 = arr.some(item => {
                    return (item.event.message_create.target.recipient_id === chatIDs[0]);
                });
                let c2 = arr.some(item => {
                    return (item.event.message_create.target.recipient_id === chatIDs[1]);
                });

                return c1 && c2;
            });

        });
    });

    it('Send text tweet - chatID is set to \'all\'', function() {
        const message = {
            text: 'Send text tweet 1\n' + new Date()
        }

        let tweetid;

        return twitter.sendMessage(message, 'all')
        .then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res).to.all.satisfy(item => {
                assert.property(item, 'tweet');
                assert.property(item, 'response');
                assert.propertyVal(item.tweet, 'text', message.text);

                return true;
            });
        });
    });
});

