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

            let text = payload.text;

            if(quick_reply)
                text += '\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (three horizontal bars to see them';


            return {
                chatID: o,
                text,
                ...quick_reply && { quick_reply },
                ...(photo != null) && { photo }
            }
        })
    });
}
