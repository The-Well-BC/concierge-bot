module.exports = (item) => {
    let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(/\s/g, '-') }-${ item.nonFungibleToken.tokenId }`;

    return {
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
            url: `https://superrare.co/${ item.creation.firstOwner.username }`
        },
        event: 'drop',
        date: item.timestamp,
        ...item.nonFungibleToken.image && {img: item.nonFungibleToken.image},
        platform: 'superrare',
        url,
        name: item.nonFungibleToken.name
    }
}
