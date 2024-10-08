const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");



module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have authority to this post");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    // let {error} = listingSchema.validate(req.body);
    // if(error){
    //     let errMsg = error.details.map((el) => el.message).join(",");
    //     throw new ExpressError(400, errMsg);
    //     //next(new ExpressError(400, errMsg));
    // } else {
    //     next();
    // }
    next();
};

//ERROR HANDLING - JOI- SCHEMA - SERVER SIDE
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body); //validating schema data, queries,conditions
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); //connecting all error messages
        //throw new ExpressError(400, errMsg);
        next( new ExpressError(400, errMsg)); //going straight to error middleware
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(review && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have authority of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};