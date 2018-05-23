'use strict';

module.exports = function(Person) {
    Person.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            ctx.instance.signature = base64ToBuffer(ctx.instance.signature);
        } else {
            ctx.data.signature = base64ToBuffer(ctx.data.signature);
        }
        
        return next();
    });
};

function base64ToBuffer(base64) {
    return new Buffer(base64, 'base64').toString('utf8');
}
