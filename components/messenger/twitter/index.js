const parseMessage = require('./parseMessage');
const prepareMessage = require('./prepareMessage');
const sendMessage = require('./sendMessage');
const plain = require('../../messageFormats/plain');

module.exports = {
    parseMessage,
    prepareMessage,

    format: plain,
    formatter: plain,

    sendMessage
}
