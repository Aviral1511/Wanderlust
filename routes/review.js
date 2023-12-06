const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

//CONTROLLER- (FOR BACKEND)
const reviewController = require("../controllers/reviews");

//REVIEW ROUTE
router.post("/" ,isLoggedIn, isReviewAuthor ,validateReview, wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId" , isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;