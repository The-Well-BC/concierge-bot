module.exports = (payload) => {
    let command, text, params;
    let data, message;

    if(payload.direct_message_events)
        data = payload.direct_message_events[0];

    message = data.message_create.message_data;

    let text_ = message.text;

    if(/^help/ig.test(text_)) {
        command = 'help'
    } else {
        command = text_.match(/\w+/)[0];

        let paramsText = text_.replace(/\s+/g, ' ').match(/(?<=\!\w+\s+).+/g);

        params = (paramsText) ? paramsText[0] : null;

        if(command === 'subscribe' && params == null)
            params = 'all';
        command = 'help'

        text = text_;
    }

    return {
        ...text && {text},
        chatID: data.message_create.sender_id,
        command: {name: command, ...params && {params} },
        format: 'plain'
    }
}
