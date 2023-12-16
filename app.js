// BASIC SET UP
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js")//require models/listings
// const Review = require("./models/review.js")//require models/review
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session")
const MongoStore = require('connect-mongo');//require mongo session
const flash = require("connect-flash")

// to use passport basic setup
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// require ExpressError
const ExpressError = require("./utils/ExpressError.js");
// CONNECT TO DATABASE
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const MONGO_URL ="mongodb+srv://siddharth-sahane:kxQh9Eg96l7gsTL8@cluster0.idmnbmp.mongodb.net/?retryWrites=true&w=majority"

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("connected DB");
    })
    .catch((err) => {
        console.log(err);
    })


app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override')
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);//set engine as ejs-Mate 
app.use(express.static(path.join(__dirname, "/public")));//to use static file

const store = MongoStore.create(
    {
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    }
);
store.on("error", () => {
    console.log("Error in Mongo session store", err);
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 100 + 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());

//to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
//all user are authenticate from LocalStrategy using User.authenticate() method

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})
// create and save demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student12@gmail.com",
//         username:"delta-student12",
//     })
//   let registerUser= await User.register(fakeUser,"helloworld1");
//   res.send(registerUser);
// })


app.use("/listings", listingRouter);// listings router required
app.use("/listings/:id/reviews", reviewRouter);// reviews router required
app.use("/", userRouter);

// to send error to error handeler when there is no such route or page exist
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// error handler
app.use((err, req, res, next) => {
    //  let { statusCode, message} = err;
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs", { err });
});

// create and react to port 8080
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

















/*demouser
email:"student12@gmail.com",
 username:"delta-student12",
 pwd:"helloworld1"
*/


// testListing route
// app.get("/testListing", async (req, res) => {
//     // res.send("HI,I test listing");
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute,Goa",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesful testing!")
// });

// if(!req.body.listing.description){
//     throw new ExpressError(400,"Description is missing!");
// }
// if(!req.body.listing.title){
//     throw new ExpressError(400,"title is missing!");
// }
// if(!req.body.listing.price){
//     throw new ExpressError(400,"price is missing!");
// }
// if(!req.body.listing.location){
//     throw new ExpressError(400,"location is missing!");
// }
// if(!req.body.listing.country){
//     throw new ExpressError(400,"country is missing!");
// }