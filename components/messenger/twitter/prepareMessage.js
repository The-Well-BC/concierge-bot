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
            let quick_reply;
            if(payload.replies) {
                let replies = payload.replies;
                let options = replies.map(item => {
                    return {
                        label: item.text
                    }
                });

                quick_reply = {
                    type: 'options',
                    options
                };

            }

            return {
                chatID: o,
                text: payload.text,
                ...quick_reply && { quick_reply },
                ...(photo != null) && { photo }
            }
        });
    });
}
