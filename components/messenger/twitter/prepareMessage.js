module.exports = function(payloadArr, chatIDs) {
    let messages = [];

    if( !Array.isArray(payloadArr) )
        payloadArr = [ payloadArr ];

    if(!chatIDs)
        throw new Error('No chat IDs');

    if( !Array.isArray(chatIDs) ) {
        if(typeof chatIDs != 'object')
            chatIDs = { chat_id: chatIDs };

        chatIDs = [ chatIDs ];
    }

    return payloadArr.map(payload => {
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return chatIDs.map(o => {
            if(!o)
                throw new Error('Chat ID not specified');

            let chatID;

            if(o != 'all')
                chatID = o;

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

            let { text, link } = payload;

            if(quick_reply)
                text += '\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (the three horizontal bars) to see them';

            if(link)
                text+= '\n\n' + link;


            return {
                ...chatID && {chatID},
                text,
                ...quick_reply && { quick_reply },
                ...(photo != null) && { photo }
            }
        })
    }).flat()
}
