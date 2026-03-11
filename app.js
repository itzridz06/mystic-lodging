if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
app.locals.mapToken = process.env.MAP_TOKEN;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");   

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


/* ================= DATABASE CONNECTION ================= */

const dbUrl = process.env.ATLASDB_URL;
if(!dbUrl){
  console.log("ATLASDB_URL not found");
}

mongoose.connect(dbUrl)
.then(()=>{
    console.log("Connected to Atlas DB");
})
.catch((err)=>{
    console.log("MongoDB connection error:", err);
});


/* ================= EXPRESS CONFIG ================= */

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


/* ================= SESSION STORE ================= */

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  ttl: 14 * 24 * 60 * 60, // session lifetime (14 days)
  autoRemove: "native"
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});


const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
  }
};

app.use(session(sessionOptions));
app.use(flash());


/* ================= PASSPORT ================= */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* ================= FLASH MESSAGES ================= */

app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});


/* ================= ROUTES ================= */

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


/* ================= ERROR HANDLING ================= */

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


/* ================= SERVER ================= */
const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});