var express = require("express");
var router = express.Router();
var Series = require("../../models/series")
var middleware = require("../../middleware");

//INDEX
	router.get("/series",function(req,res){
		Series.find({},function(err,series){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
			res.render("series/index",{series : series});	
		});
	});

//NEW and CREATE
	router.get("/series/new",middleware.isLoggedIn,function(req,res){
		res.render("series/new");
	});
	
	router.post("/series",middleware.isLoggedIn,function(req,res){
		var title = req.body.series.title;
		var body = req.body.series.body;
		var desc = req.body.series.desc;
		var author = {	
			id: req.user._id,
			username: req.user.username
		}
		var newSeries = {title : title, desc:desc,body:body,author:author};
		Series.create(newSeries,function(err,newSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/series");
		});
	});

//SHOW
	router.get("/series/:id",function(req,res){
		Series.findById(req.params.id).populate("comments").exec(function(err,foundSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("series/show",{series:foundSeries});
		});
	});

//EDIT and UPDATE
	router.get("/series/:id/edit",middleware.isSeriesOwner,function(req,res){
		Series.findById(req.params.id,function(err,updateSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("series/edit",{series:updateSeries});
		});
	});

	router.put("/series/:id",middleware.isSeriesOwner,function(req,res){
		Series.findByIdAndUpdate(req.params.id,req.body.series,function(err,updatedSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/series/"+req.params.id);
		});
	});

//DESTROY
	router.delete("/series/:id",middleware.isSeriesOwner,function(req,res){
		Series.findByIdAndDelete(req.params.id,function(err){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/series")
		});
	});

module.exports = router;