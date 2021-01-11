module.exports = (item, filter) => {
    if(!filter.creators)
        return true
    else if(Array.isArray(filter.creators)) {
        if(item.creator && item.creator.name) {
            if(filter.creators.includes(item.creator.name))
                return true;
            else
                return false;
        } else
            return false;
    }
    else return false;
}
