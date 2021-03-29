const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const twitter = require('../../../components/messenger/twitter');
const payload = require('../../twitterSamplePayload');
const chatID = payload.chatID;
const chatIDs = [payload.chatID,payload.chatID1];

describe('Twitter methods: Send Text Message', function() {
    it('Should have link at the end of text if link property is included.', function() {
        const message = {
            text: 'Succeeded in sending text with link\n' + new Date(),
            link: 'https://test.xyz'
        }

        let tweetid;

        return twitter.sendMessage(message, [...chatIDs, 'all'])
        .then(res => {
            expect(res).to.not.be.empty;

            expect(res).to.all.satisfy( item => {
                expect(item).to.have.property('messenger', 'twitter');
                let text = (item.event) ? item.event.message_create.message_data.text : item.tweet.text;
                let url = (item.event) ?  item.event.message_create.message_data.entities.urls[0].expanded_url : item.tweet.entities.urls[0].expanded_url;

                expect(text).to.contain(message.text);
                expect(url).to.equal('https://test.xyz');

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
                let c1 = arr.every(item => {
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

                return c1 && dm1 && dm2;
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
    it('Should send photos if photo is specified', function() {
        const message = {
            text: 'PHOTO MESSAGE\nSucceeded in sending text only DM for multiple users and one tweet\n' + new Date().toDateString(),
            img: 'https://ipfs.pixura.io/ipfs/QmfGPaD6kKoKVzjQUcj2KHEL4JWTPikGewREbYz4TywNWg/into-the-ether-verse.mp4'
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

                    console.log('DM MESSAGE TEXT', item.event.message_create.message_data.text);
                    expect(item.event.message_create.message_data.text).to.have.string(message.text);

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
                        expect(item.tweet.text).to.have.string(message.text);

                    return c1;
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
});

