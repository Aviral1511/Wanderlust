const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn ,isOwner, validateListing} = require("../middleware");

//MULTER FOR FILE UPLOADING
const multer = require("multer");
const {storage} = require("../cloudConfig")
const upload = multer({storage});

//CONTROLLERS - (FOR BACKEND)
const listingController = require("../controllers/listings");

//ERROR HANDLING - JOI- SCHEMA - SERVER SIDE

//HOME & CREATE ROUTE
router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing ,wrapAsync(listingController.createListing));

//NEW ROUTE
router.get('/new' , isLoggedIn ,listingController.renderNewForm);

//SHOW, UPDATE AND DELETE ROUTE
router.route("/:id")
.get( wrapAsync(listingController.showAllListings))
.post( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, isOwner, validateListing,  wrapAsync(listingController.editListing));


/*
//HOME ROUTE
//router.get('/' ,wrapAsync (listingController.index));

//SHOW ROUTE
//router.get('/:id' , wrapAsync(listingController.showAllListings));

//CREATE ROUTE
//router.post('/',isLoggedIn, validateListing ,wrapAsync(listingController.createListing));

//UPDATE ROUTE
//router.post('/:id', isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

//DELETE ROUTE
//router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
*/

module.exports = router;
