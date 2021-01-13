const format = require('../../messageFormats/markdownV2');

module.exports = (payload) => {
    let text_ = payload.message.text;
    let chatID = payload.message.chat.id;

    let text, command, params;
    let user = {}

    if(text_.indexOf('/') == 0) {
        command = text_.match(/(?<=\/)\w+/)[0];

        let paramsText = text_.replace(/\s+/g, ' ').match(/(?<=\/\w+\s+).+/g);

        params = (paramsText) ? paramsText[0].split(' ') : null;

        if(command === 'subscribe' && params == null)
            params = 'all';
    } else if(/help/ig.test(text_)) {
        command = 'help'
    } else {
        text = text_;
    }

    if(payload.message.chat.type === 'private') {
        user.name = payload.message.from.first_name;
        user.username = payload.message.from.username;
    }


    return {
        ...text && {text}, user,
        command: {name: command, ...params && {params} },
        chatID,
        formatter: format
    };
}
