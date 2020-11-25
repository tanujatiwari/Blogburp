var express= require("express");
var router  = express.Router();
var Series = require("../../models/series");
var Comment = require("../../models/comment");
var middleware = require("../../middleware");

//NEW
	router.get("/series/:id/comments/new",middleware.isLoggedIn,function(req,res){
		Series.findById(req.params.id,function(err,series){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("comments/series/new",{series : series});
		});
	});

	router.post("/series/:id/comments",middleware.isLoggedIn,function(req,res){
		Series.findById(req.params.id,function(err,series){
			if(err){
				req.flash("error","Something went wrong...Please try again later!");
				res.redirect("/series")
			}
			else{
				//create new comment
				Comment.create(req.body.comment,function(err,comment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						series.comments.push(comment);
						series.save();
						req.flash("success","Thanks for the review <3")
						res.redirect("/series/" + series._id);
					}
				});
			}
		});
	});

//EDIT
	router.get("/series/:id/comments/:comment_id/edit",middleware.isLoggedIn,function(req,res){
		Series.findById(req.params.id,function(err,foundSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err)
					req.flash("error","Something went wrong...Please try again later!");
				else{
					res.render("comments/series/edit",{series: foundSeries, comment: foundComment});
			}
		});
			}
		});
	});

	router.put("/series/:id/comments/:comment_id",middleware.isLoggedIn,function(req,res){
		Series.findById(req.params.id,function(err,foundSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Successfully edited your comment :D ")
						res.redirect("/series/"+req.params.id);
					}
				});
			}
		});
	});

//DESTROY
	router.delete("/series/:id/comments/:comment_id",middleware.isLoggedIn,function(req,res){
		Series.findById(req.params.id,function(err,foundSeries){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndRemove(req.params.comment_id,function(err){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Successfully deleted your review!")
						res.redirect("/series/"+req.params.id);
					}
				});
			}
		});
	});

module.exports = router;