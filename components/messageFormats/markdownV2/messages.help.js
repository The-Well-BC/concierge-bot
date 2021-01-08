module.exports = {
    main:  {
        text: 'Trade Drop Bot will alert you to transactions and new drops on NFT trading platforms. Currently, it supports Nifty Gateway, SuperRare, Foundation and Zora'
    },
    default:  {
        text: 'Don\'t have this help item'
    },
    subscribe: {
        text: 'You can subscribe to alerts from only certain platforms. \nTo subscribe to all platforms, simply type */subscribe*. To subscribe to alerts from a particular platform, just type */subscribe <platform>*.\n If you would like to receive updates from Zora instead, type */subscribe zora*.',
        replies: [
            {text: '/subscribe'},
            {text: '/subscribe zora'},
            {text: '/subscribe nifty'},
            {text: '/subscribe superrare'},
            {text: '/subscribe foundation'}
        ]
    },
}
