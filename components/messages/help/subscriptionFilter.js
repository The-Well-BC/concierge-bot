const commands = require('../messengerCommands');

module.exports = function(messenger, format, params) {
    let subC = commands.subscribe[messenger ];
    let helpC = commands.help[messenger ];
    let filterC = commands.subscriptionFilters[messenger ];

    let replies = [
        { text: filterC },
        { text: helpC + " subscribe"  }
    ];

    let examples;

    switch(format.toLowerCase()) {
        case 'markdown':
        case 'markdownv2':
            examples = `*${subC} sales\n${subC} to creator Maalavidaa drops*`;
            break;

        case 'plain':
        default:
            examples = `${subC} sales\n${subC} to creator Maalavidaa drops`;
            break;

    }

    let response = {
        text: `Your subscription filters determine the type of alerts you will get. Subscription filters are created when you use the ${subC} command.\nYou can combine one or more conditions into a single filter. For example:\n\n${examples}\n\nYou will only receive messages that pass one or more of your filters.\nTo view your filters, text ${filterC}.`,
        replies: replies
    }

    return response;
}
