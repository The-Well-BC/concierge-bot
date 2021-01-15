module.exports = (item) => {
    let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(' ', '-') }-${ item.nonFungibleToken.tokenId }`;

    return {
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
            url: `https://superrare.co/${ item.creation.firstOwner.username }`
        },
        event: 'drop',
        date: item.timestamp,
        img: item.nonFungibleToken.image,
        platform: 'superrare',
        url,
        name: item.nonFungibleToken.name
    }
}
