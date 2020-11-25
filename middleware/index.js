var Poetry = require("../models/poetry");
var Comment = require("../models/comment");
var Proses = require("../models/proses");
var Series = require("../models/series");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first!")
	res.redirect("/login");
}

middlewareObj.isPoetryOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Poetry.findById(req.params.id,function(err,updatePoetry){
			if(err){
				req.flash("error","Something went wrong! Try again later :/");
				res.redirect("back");
			}
			else{
				if(updatePoetry.author.id.equals(req.user._id)){
					next();	
				}
				else{
					req.flash("You don't have permission to do that!")
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You don't have permission to do that :/");
		res.redirect("back");
	}
}

middlewareObj.isProseOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Proses.findById(req.params.id,function(err,updatePoetry){
			if(err){
				req.flash("error","Something went wrong! Try again later :/")
				res.redirect("back");
			}
			else{
				if(updatePoetry.author.id.equals(req.user._id)){
					next();	
				}
				else{
					req.flash("You don't have permission to do that! :|")
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You don't have permission to do that! :|");
		res.redirect("back");
	}
}


middlewareObj.isSeriesOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Series.findById(req.params.id,function(err,updatePoetry){
			if(err){
				req.flash("error","Something went wrong...Please try again later")
				res.redirect("back");
			}
			else{
				if(updatePoetry.author.id.equals(req.user._id)){
					next();	
				}
				else{
					req.flash("You don't have permission to do that!")
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You don't have permission to do that! :/");
		res.redirect("back");
	}
}

middlewareObj.isCommentOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				if((foundComment.author.id.equals(req.user._id)) || req.user.username===process.env.ADMIN){
					next();	
				}
				else{
					req.flash("What are your intentions, huh? :/")
					res.redirect("back");
				}
			}
		});
	}
	else{
		res.redirect("back");
	}
}

middlewareObj.isDeveloper = function(req,res,next){
	console.log(req.user);
	if(req.user && req.user.username===process.env.ADMIN){
		next();
	}
	else{
		res.redirect("back");
	}
}

module.exports = middlewareObj;