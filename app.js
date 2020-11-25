require("dotenv").config();
var express = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	Poetry = require("./models/poetry"),
	Proses = require("./models/proses"),
	Series = require("./models/series"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	methodOverride = require("method-override");

var poetryComments = require("./routes/poetry/comments"),
    poetryRoutes   = require("./routes/poetry/poetry"),
    prosesComents  = require("./routes/proses/comments"),
    prosesRoutes   = require("./routes/proses/proses"),
    seriesComments = require("./routes/series/comments"),
    seriesRoutes   = require("./routes/series/series"),
	indexRoutes    = require("./routes/index");

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(flash());

var url = process.env.DBURL || "mongodb://localhost:27017/frippy2";
mongoose.connect(url,{useNewUrlParser : true, useUnifiedTopology: true});

//PASSPORT CONFIG

app.use(require("express-session")({
	secret : "Its all in the mind",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(poetryRoutes);
app.use(poetryComments);
app.use(prosesRoutes);
app.use(prosesComents);
app.use(seriesRoutes);
app.use(seriesComments);

//=================================================================

app.listen(process.env.PORT || 1000, function() {
    console.log("Server started");
});