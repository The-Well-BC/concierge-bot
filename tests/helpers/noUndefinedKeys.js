module.exports = function(chai, utils) {

    let Assertion = chai.Assertion;

    Assertion.addMethod('noUndefinedKeys', function(exceptions) {

        //exceptions must be an array
        let obj = this._obj
        if( !Array.isArray(obj) )
            obj = [ obj ];

        if( exceptions && !Array.isArray(exceptions))
            throw new Error('Exceptions must be an array');

        let assert = this.assert;

        return obj.forEach(item => {
            for (key in item) {
                let value = item[key];
                let conditions =  value !== undefined;

                if(!exceptions || !exceptions.includes(key)) {
                    conditions = conditions && value != undefined && value != null;
                    assert(conditions === true,
                        `expected property "${ key }" of item to not be undefined or null`,
                        '',
                        'not undefined',
                        value
                    );
                }

                if(typeof value === 'number') {
                    assert( !isNaN(value), 
                        `expected Property "${ key } of #{this} to not be NaN`
                    );
                }

                if(typeof value === 'string') {
                    assert( !value.includes('NaN'),
                        `String property '${ key }' includes NaN: ${ value }`
                    );
                }
            }
        });
    });
}
