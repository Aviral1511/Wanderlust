const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

router.get("/search", wrapAsync(async (req,res) => {
    let country = req.query.country;
    const allListings = await Listing.find({"country" : country});
    //console.log(allListings,country);
    res.render("./listings/find.ejs",{allListings});
}));

router.get("/:country", wrapAsync(async (req, res) => {
    let {country} = req.params;
    const allListings = await Listing.find({"country" : country});
    //console.log(allListings,country)
    res.render("./listings/find.ejs",{allListings});
}));

module.exports = router;