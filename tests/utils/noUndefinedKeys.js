module.exports = function(item, exceptions) {
    //exceptions must be an array
    if( exceptions && !Array.isArray(exceptions))
        throw new Error('Exceptions must be an array');

    return Object.keys(item).every(key => {
        let value = item[key];
        let conditions =  value !== undefined;

        if(conditions === false) {
            console.debug(`Property '${ key }' is undefined:`, value);
            return conditions;
        }

        if(!exceptions || !exceptions.includes(key)) {
            conditions = conditions && value != undefined && value != null;
            if(conditions === false) {
                console.debug(`Property '${ key }' is undefined or null:`, value);
                return conditions;
            }
        }

        if(typeof value === 'number') {
            conditions = conditions && !isNaN(value)
            if(conditions === false) {
                console.debug('Item is NaN', value);
                console.debug(`Property '${ key }' is NaN:`, value);
                return conditions;
            }
        }

        if(typeof value === 'string') {
            conditions = conditions && !value.includes('NaN');
            if(conditions === false) {
                console.debug(`String property '${ key }' includes NaN: `, value);
                return conditions;
            }
        }

        return conditions;
    });
}
