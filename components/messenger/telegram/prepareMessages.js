module.exports = function(payloadArr, chatIDs) {
    if( !Array.isArray(payloadArr) )
        payloadArr = [ payloadArr ];

    return payloadArr.map(payload => {
        if(!chatIDs)
            throw new Error('No chat IDs');

        if( !Array.isArray(chatIDs) ) {
            if(typeof chatIDs != 'object')
                chatIDs = { chat_id: chatIDs };

            chatIDs = [ chatIDs ];
        }

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return chatIDs.map(o => {
            let method = (photo) ? 'sendPhoto': 'sendMessage';
            let reply_markup = (payload.replies) ? { keyboard: [ payload.replies ] } : null;

            return {
                chat_id: o,
                text: payload.text,
                method,
                ...reply_markup && { reply_markup },
                parse_mode: 'Markdown',
                ...(photo != null) && { photo }
            }
        });
    });
}