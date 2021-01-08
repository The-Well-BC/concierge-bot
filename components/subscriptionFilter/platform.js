module.exports = (item, filter) => {
    if(!filter.platforms)
        return true
    else if(filter.platforms && filter.platforms.includes(item.platform))
        return true;

    else return false;
}
