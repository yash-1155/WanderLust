const express = require("express");
const router = express.Router({ mergeParams: true });//to create new router object
// require wrapasync
const wrapAsync = require("../utils/wrapAsync.js");
// require server side schema
const { listingSchema, reviewSchema } = require("../schema.js")
// require ExpressError
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")//require models/review
const Listing = require("../models/listing.js")//require models/listings
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/review.js");

// // validate review
// const validateReview = (req, res, next) => {
//     // let result = listingSchema.validate(req.body);
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };



// Reviews
// post route of review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
//   /listings/:id/reviews/:reviewId
//http://localhost:8080/listings/65782bdfee81326c53683acb/reviews/65785324a4243825e1f94312?_method=DELETE
// delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;