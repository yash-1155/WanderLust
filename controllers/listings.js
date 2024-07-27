const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js")//require models/listings

//set up for Geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//for using geocodeing services
const mapToken = process.env.MAP_TOKEN;
const GeocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs")
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        // .populate("reviews")
        .populate("owner");
    if (!listing) {
        req.flash("error", " Listing You requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await GeocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();
    // console.log();//{ type: 'Point', coordinates: [ 77.209006, 28.613895 ] }
    // res.send("Done!")
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "   ::  ", filename);
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    let savesListing = await newListing.save();
    console.log(savesListing);
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    //  console.log(allListings);
    if (!listing) {
        req.flash("error", " Listing You requested does not exist!");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log("DELTED SUCCESSFULLY!!");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}