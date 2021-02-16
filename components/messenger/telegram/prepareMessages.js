module.exports = function(payloadArr, chatIDs) {
    if( !Array.isArray(payloadArr) )
        payloadArr = [ payloadArr ];

    let messages = [];

    payloadArr.forEach(payload => {
        if(!chatIDs)
            throw new Error('No chat IDs');

        if( !Array.isArray(chatIDs) ) {
            if(typeof chatIDs != 'object')
                chatIDs = { chat_id: chatIDs };

            chatIDs = [ chatIDs ];
        }

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return chatIDs.forEach(o => {
            let method = (photo) ? 'sendPhoto': 'sendMessage';
            let reply_markup
            if(payload.replies) {
                let replies = payload.replies.map(item => [item]);
                reply_markup = {
                    keyboard: replies,
                    one_time_keyboard: true
                };
            }

            messages.push({
                chat_id: o,
                text: payload.text,
                method,
                ...reply_markup && { reply_markup },
                parse_mode: 'MarkdownV2',
                ...(photo != null) && { photo }
            });
        });
    });

    return messages;
}
