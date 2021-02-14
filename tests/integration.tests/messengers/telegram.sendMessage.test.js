const chai = require('chai');
const expect = chai.expect;

const telegram = require('../../../components/messenger/telegram');

describe('Send Telegram Messsage', function() {
    it('Send text message: chat ID', function() {
        const message = {
            text: `Testing telegram message method.\nTesting new lines`
        }

        return telegram.sendMessage(message, ['641574672'])
        .then(res => {
            expect(res).to.all.satisfy(item => {
                expect(item).to.have.property('ok', true);
                expect(item.result.from).to.have.property('is_bot', true);
                expect(item.result.chat.id).to.equal(641574672);
                expect(item.result.text).to.equal(message.text);

                expect(item).to.not.have.property('error');

                return true;
            });
        });
    });

    it('Send text message to multiple chat IDs', function() {
        const messages = [{
            text: `Test: Send message to two chats on telegram`
        }]

        const chatIDs = [641574672, 659038858]

        return telegram.sendMessage(messages, chatIDs)
        .then(res => {
            expect(res).to.satisfy(arr => {

                let message1 = arr.some(item => {
                    return item.result.chat.id === chatIDs[0];
                });

                let message2 = arr.some(item => {
                    return item.result.chat.id === chatIDs[1];
                });

                expect(message1 && message2).to.be.true;

                let general = arr.every(item => {
                    expect(item).to.have.property('ok', true);
                    expect(item.result.from).to.have.property('is_bot', true);
                    expect(item.result.text).to.equal(messages[0].text);

                    expect(item).to.not.have.property('error');
                });

                return true;
            });
        });
    });
    it('Send photo message to multiple chat IDs', function() {
        const messages = [{
            img: 'https://picsum.photos/200/300.jpg',
            text: `Test: Send message api here blah blah`
        }]

        const chatIDs = [641574672, 659038858]

        return telegram.sendMessage(messages, chatIDs)
        .then(res => {
            expect(res).to.satisfy(arr => {
                console.log('AALL MESSGAEDE SESENG', res);

                let message1 = arr.some(item => {
                    return item.result.chat.id === chatIDs[0];
                });

                let message2 = arr.some(item => {
                    return item.result.chat.id === chatIDs[1];
                });

                expect(message1 && message2).to.be.true;

                let general = arr.every(item => {
                    expect(item.result).to.include.keys('caption', 'photo');
                    expect(item).to.have.property('ok', true);
                    expect(item.result.from).to.have.property('is_bot', true);
                    console.log('ITEM', item);
                    expect(item.result.caption).to.equal(messages[0].text);

                    expect(item).to.not.have.property('error');
                });

                return true;
            });
        });
    });
    it('#dev Send gif message to multiple chat IDs', function() {
        const messages = [{
            img: 'https://res.cloudinary.com/nifty-gateway/image/upload/v1592327375/Twisted%20Vacancy/Kikai_Ningyou_btgdos.gif',
            text: `Test: Send message api here blah blah`
        }]

        const chatIDs = [641574672, 659038858]

        return telegram.sendMessage(messages, chatIDs)
        .then(res => {
            expect(res).to.satisfy(arr => {
                let message1 = arr.some(item => {
                    return item.result.chat.id === chatIDs[0];
                });

                let message2 = arr.some(item => {
                    return item.result.chat.id === chatIDs[1];
                });

                expect(message1 && message2).to.be.true;

                let general = arr.every(item => {
                    expect(item).to.have.property('ok', true);
                    expect(item.result.from).to.have.property('is_bot', true);
                    expect(item.result.caption).to.equal(messages[0].text);

                    expect(item).to.not.have.property('error');
                });

                return true;
            });
        });
    });
    it('Send video message to multiple chat IDs', function() {
        const messages = [{
            img: 'https://res.cloudinary.com/nifty-gateway/video/upload/q_auto:good,w_500/v1608176853/PakxTJ/fusion_a6ugvm.mp4',
            text: `Test: Send message api here blah blah`
        }]

        const chatIDs = [641574672, 659038858]

        return telegram.sendMessage(messages, chatIDs)
        .then(res => {
            expect(res).to.satisfy(arr => {
                let message1 = arr.some(item => {
                    return item.result.chat.id === chatIDs[0];
                });

                let message2 = arr.some(item => {
                    return item.result.chat.id === chatIDs[1];
                });

                expect(message1 && message2).to.be.true;

                let general = arr.every(item => {
                    expect(item).to.have.property('ok', true);
                    expect(item.result.from).to.have.property('is_bot', true);
                    expect(item.result).to.include.keys('caption', 'photo');

                    expect(item.result.caption).to.equal(messages[0].text);

                    expect(item).to.not.have.property('error');
                });

                return true;
            });
        });
    });
});
