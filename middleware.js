// require server side schema
const { listingSchema,reviewSchema } = require("./schema.js")
// require ExpressError
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "  ::", req.originalUrl);
    if (!req.isAuthenticated()) {
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged In!")
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(req.session);
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next()
}

// validate listing
module.exports.validateListing = async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// validate review
module.exports.validateReview =async (req, res, next) => {
    // let result = listingSchema.validate(req.body);
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next()
}
