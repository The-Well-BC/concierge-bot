module.exports = (filter) => {
    let text;

    if(filter == 'all') {
        text = 'You have opted to receive notifications whenever any NFTs are traded or released.';
    } else if(typeof filter === 'object' && filter != null) {
        text = `Successfully added subscription filter: `;

        let { events, platforms, creators } = filter;

        if(events) {
            events = events.map(i => {
                if(i.substring(i.length - 1) !== 's')
                    i += 's';

                return i;
            });

            if(events.length > 1)
                events[events.length - 1] = 'and ' + events[events.length - 1];
            text += `NFT ${ events.join(', ') }`;
            if(creators)
                text += 'for ';
        } else if(!creators)
            text += 'NFT events ';

        if(creators) {
            text += `NFTs created by ${ filter.creators.join(', ') }`;
        }

        if( Array.isArray(platforms)) {
            let platformStr = platforms.map(p => p.name);
            if(platformStr.length > 1 ) {
                let last = platformStr[platformStr.length - 1];
                platformStr[platformStr.length - 1] = 'and ' + last;
            }

            platformStr = platformStr.join(', ');

            text = `Successfully added subscription filter: NFT events on ${ platformStr }`;
        }
    }

    return {
        text
    }
}
