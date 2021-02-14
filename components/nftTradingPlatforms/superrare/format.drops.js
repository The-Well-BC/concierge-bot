module.exports = (item) => {
    return {
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
            url: `https://superrare.co/${ item.creation.firstOwner.username }`
        },
        event: 'drop',
        date: item.timestamp,
        ...item.nonFungibleToken.image && {img: item.nonFungibleToken.image},
        platform: 'superrare',
        name: item.nonFungibleToken.name
    }
}
