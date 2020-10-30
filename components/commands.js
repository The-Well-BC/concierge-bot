const subscribedao = require('./subscription.dao');

subscribe = function(command, chat_id) {
    let services = ['foundation', 'zora'];
    let counter = 0;
    const subscribeAll = () => {
        if(counter === services.length)
            return
        else {
            return subscribedao.addServiceSubscription(chat_id, services[counter])
            .then(() => {
                counter++;
                subscribeAll()
            });
        }
    };

    if(command == '/subscribe')
        return subscribeAll();
    else {
        let subservice;
        services.forEach(o => {
            if(command.includes(o)) {
                subservice = o;
            }
        });

        if(subservice) {
            return subscribedao.addServiceSubscription(chat_id, subservice)
            .then(res => true );
        } else return new Promise(resolve => resolve(false));
    }
}

module.exports = {
    runCommand: function(payload) {
        let command = payload.message.text;

        if(command.indexOf('/subscribe') == 0)
            return subscribe(command, payload.message.chat.id);
        else
            return new Promise(resolve => resolve(true));
    }
}
