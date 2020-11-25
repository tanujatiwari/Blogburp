var express= require("express");
var router  = express.Router();
var Poetry = require("../../models/poetry");
var middleware = require("../../middleware")

//INDEX
	router.get("/poetry",function(req,res){
		Poetry.find({},function(err,poetry){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
			res.render("poetry/index",{poetry:poetry});	
		});
	});

//NEW and CREATE
	router.get("/poetry/new",middleware.isDeveloper,function(req,res){
		res.render("poetry/new");
	});
	
	router.post("/poetry",middleware.isDeveloper,function(req,res){
		var title = req.body.poetry.title;
		var quote = req.body.poetry.quote;
		var poem = req.body.poetry.poem;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newPoetry = {title: title, quote: quote, poem:poem , author:author}
		Poetry.create(newPoetry,function(err,newPoetry){
			if(err){
				req.flash("error","Something went wrong...Please try again later!");
			}
			else{
				res.redirect("/poetry");
			}
		});
	});

//SHOW
	router.get("/poetry/:id",function(req,res){
		Poetry.findById(req.params.id).populate("comments").exec(function(err, poetry){
			if(err){
				req.flash("error","Something went wrong...Please try again later!");
			} else {
				res.render("poetry/show", {poetry: poetry});
			}
		});
	});

//EDIT and UPDATE
	router.get("/poetry/:id/edit",middleware.isPoetryOwner,function(req,res){
		Poetry.findById(req.params.id,function(err,updatePoetry){
			res.render("poetry/edit",{poetry:updatePoetry});
		});
	});

	router.put("/poetry/:id",middleware.isPoetryOwner,function(req,res){
		Poetry.findByIdAndUpdate(req.params.id,req.body.poetry,function(err,updatedPoetry){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/poetry/"+req.params.id);
		});
	});

//DESTROY
	router.delete("/poetry/:id",middleware.isPoetryOwner,function(req,res){
		Poetry.findByIdAndDelete(req.params.id,function(err){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/poetry")
		});
	});

module.exports = router;
