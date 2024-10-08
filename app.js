//FOR CLOUD STORAGE - FILE UPLOAD
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const port = 8080;
const ExpressError = require("./utils/ExpressError");

//ROUTES ACCESS
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const categoryRouter = require("./routes/category.js");
const findRouter = require("./routes/find.js");

//FOR FLASH
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


//MONGO-URL

//CLOUD URL
const dbURL = process.env.ATLASDB_URL;

//requiring mongoose
const mongoose = require('mongoose');
main()
.then(() => {
    console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
};

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600 //saved after this seconds
});

store.on(("error"), (err) => {
    console.log("Error occured", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,  //session saved only when modified
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,  //session cookie expires after this time
        maxAge : 7 * 24 * 60 * 60 * 1000, //session cookie gets deleted after this time
        httpOnly : true,  //cookie sent over only https
    }
};

app.use(session(sessionOptions));
app.use(flash());

//FOR AUTHENTICATION
const passport = require("passport");
const LocalStrtegy = require("passport-local");
const User = require("./models/user.js");


//PASSPORT MIDDLEWARE - used after session middleware, bcoz it requires session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtegy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //helps in storing users info
passport.deserializeUser(User.deserializeUser()); //helps in fetching users info

// app.use("/demoUser", async (req,res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);

// });



const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate); // helps in accessing ejs files, templates
const path = require("path");
app.set("views",path.join(__dirname, "/views")); // in veiws directory our ejs files are stored
app.set("view engine","ejs");
app.use(express.static("public")); //static files from public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
const methodOverride = require("method-override"); // helps in suppporting put, delete
app.use(methodOverride("_method")); //helps in doing above




//MAIN WORKINGS ;
app.listen(port, () => {
    console.log("Listening")
});
// app.get('/', (req,res) => {
//     res.render("./listings/home.ejs");
// });

//FLASING MESSAGES
app.use((req,res,next) => {
    res.locals.success = req.flash("success"); //res.locals make it available to all ejs templates -> success messages assignes to res.locals.success
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use('/listings', listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/category", categoryRouter);
app.use("/",userRouter);
app.use("/find",findRouter);


app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not Found!"));
});


//CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs", {err});
    // res.status(statusCode).send(message);
});


