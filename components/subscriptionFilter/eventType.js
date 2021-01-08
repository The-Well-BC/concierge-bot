module.exports = (item, filter) => {
    if(!filter.events)
        return true
    else if(filter.events && filter.events.includes(item.event))
        return true;

    else return false;
}
