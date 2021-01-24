const dateFormatter = require('../../utils/dateFormatter');
const plain = require('./format.plain');
const markdown = require('./format.markdown');
const markdownV2 = require('./format.markdownV2');

module.exports = function(payload, format) {
    let text;

    switch(format) {
        case 'plain':
            text = plain(payload, format)
            break;
        case 'markdown':
            text = markdown(payload, format);
            break;
        case 'markdownV2':
        case 'markdownv2':
            text = markdownV2(payload, format);
            break;
    }

    return text;
}
