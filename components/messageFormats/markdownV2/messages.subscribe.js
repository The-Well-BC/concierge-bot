module.exports = (platforms) => {
    let text;

    if( Array.isArray(platforms)) {
        let platformStr = platforms.map(p => p.name);
        if(platformStr.length > 1 ) {
            let last = platformStr[platformStr.length - 1];
            platformStr[platformStr.length - 1] = 'and ' + last;
        }

        platformStr = platformStr.join(', ');

        text = `You have opted to receive notifications whenever any NFTs are traded or released on the following platforms: ${ platformStr }.`;

    } else if(platforms == 'all')
        text = 'You have opted to receive notifications whenever any NFTs are traded or released.';

    return {
        text
    }
}
