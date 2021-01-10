module.exports = (platforms) => {
    let text;

    if( Array.isArray(platforms))
        text = `You have subscribed to receive alerts whenever drops are traded or released on the following platforms: ${ platforms } `;
    else if(platforms == 'all')
        text = 'You have subscribed to receive alerts whenever drops are traded or new drops are released ';

    return {
        text
    }
}
