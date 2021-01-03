module.exports = (err) => {
    return {
        invalid_platform: {
            telegram: `The NFT platform "${ err.platform }" is currently not available. Try /browse to see what platforms you can subscribe to`
        }
    }
}
