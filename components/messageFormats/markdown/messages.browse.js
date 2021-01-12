module.exports = (messenger, commands) => {
    let text;

    text = 'Browse and subscribe to creators, NFT categories';
    replies = [
        { text: commands.browseCreators[messenger] }
    ]

    return {
        text,
        replies
    }
}
