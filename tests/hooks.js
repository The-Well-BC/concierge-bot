const teardown = require('./teardown');

exports.mochaHooks = {
    beforeAll(){
        console.log('BEFOR ALL');
        return teardown();
    },
}
