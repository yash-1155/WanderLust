const express = require("express");
const router = express.Router();
// require wrapasync
const wrapAsync = require("../utils/wrapAsync.js");
// require server side schema
// const { listingSchema } = require("../schema.js")
// require ExpressError
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")//require models/listings

const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
// for parsing file image to upload folder
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });//locally store at folder


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);

// } );
// req.file=>>>>{"fieldname":"listing[image]","originalname":"WIN_20230807_15_12_18_Pro.jpg","encoding":"7bit","mimetype":"image/jpeg","destination":"upload/","filename":"1d721db021e6dc213eca056695f42c6b","path":"upload\\1d721db021e6dc213eca056695f42c6b","size":106653}

// =>>>>Index Routerouter.get("/", wrapAsync(listingController.index));
// =>>>>// CREATE ROUTE
// =>>>>using wrapasyncrouter.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));
// CREATE ROUTE
// using wrapasync
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));



//  New Route,show new form only when user is logged in
router.get("/new", isLoggedIn, listingController.renderNewForm)


// show route
//router.get("/:id", wrapAsync(listingController.showListing));
// Update Route
//router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))=>>>>>>
// DELETE ROUTE
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
// combine them
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, 
        isOwner, 
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))


// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;












// using try catch
// app.post("/listings", async (req, res,next) => {
//     try {
//         const newListing=new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");

//     } catch (error) {
//         console.log("error has been occured!")
//         next(error);//call to error handler
//     }
// });
