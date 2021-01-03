const teardown = require('./teardown');

exports.mochaHooks = {
    beforeAll(){
        return teardown();
    },
}
