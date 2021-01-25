module.exports = function(err, messenger) {
    console.log('MERRREO ', err, messenger, arguments);
    if(!err) {
        return {
            badCommand: {
                text: 'Command not recognized. Type in help to see what commands are available'
            }
        }
    } else {
        return {
            invalid_platform: {
                text: `The NFT platform "${ err.platform }" is currently not available. Try /browse to see what platforms you can subscribe to`,
            }

        }
    }
}


