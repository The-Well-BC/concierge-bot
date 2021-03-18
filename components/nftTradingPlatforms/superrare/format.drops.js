module.exports = (item) => {
    return {
        creator: item.creator,
        event: 'drop',
        date: new Date(item.created * 1000),
        platform: 'superrare',
        name: item.name
    }
}
