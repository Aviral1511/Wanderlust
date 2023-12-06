const Listing = require("../models/listing");

//FOR MAPS
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs");
};

module.exports.showAllListings = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist");
        res.redirect("/listings");
    } else 
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
        

    let url = req.file.path;
    let fileName = req.file.filename;
    let listing = req.body.listing;
    let filter = req.body.listing.filter;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, fileName};
    newListing.geometry = response.body.features[0].geometry;
    newListing.filter.type = filter ;
    let finListing = await newListing.save();
    console.log(finListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings"); 
};

module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_200,w_200");

    res.render("./listings/edit.ejs",{listing, originalUrl});   

};

module.exports.updateListing = async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send Valid data for Listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = {url, fileName};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};