//handling errors from async functions
function wrapAsync(fn) {
    return function(req, res, next){
        fn(req,res,next).catch(next);
    }
}
module.exports = wrapAsync;