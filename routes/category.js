const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");

router.get("/:type", wrapAsync (async (req,res,err) => {
    const filterType = req.params.type;
    const allListings = await Listing.find({"filter.type": filterType});
    res.render("./listings/filter.ejs", {allListings});
    
}));

module.exports = router;