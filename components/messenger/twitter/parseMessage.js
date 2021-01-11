const format = require('../../messageFormats/plain');

module.exports = (payload) => {
    let command, text, params;
    let data, message;
    console.log('PAYLOAD', payload);

    if(payload.direct_message_events)
        data = payload.direct_message_events[0];

    message = data.message_create.message_data;

    let text_ = message.text;

    if(text_.indexOf('!') == 0) {
        command = text_.match(/(?<=\!)\w+/)[0];

        let paramsText = text_.replace(/\s+/g, ' ').match(/(?<=\!\w+\s+).+/g);

        params = (paramsText) ? paramsText[0].split(' ') : null;

        if(command === 'subscribe' && params == null)
            params = 'all';
    } else {
        text = text_;
    }

    return {
        ...text && {text},
        chatID: data.message_create.sender_id,
        command: {name: command, ...params && {params} },
        formatter: format
    }
}
