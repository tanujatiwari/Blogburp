var express= require("express");
var router  = express.Router();
var Poetry = require("../../models/poetry");
var Comment = require("../../models/comment");
var middleware = require("../../middleware")


//NEW	
	router.get("/poetry/:id/comments/new",middleware.isLoggedIn,function(req,res){
		Poetry.findById(req.params.id,function(err,poem){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("comments/poetry/new",{poetry : poem});
		});
	});

	router.post("/poetry/:id/comments",middleware.isLoggedIn, function(req,res){
		Poetry.findById(req.params.id,function(err,poem){
			if(err){
				req.flash("error","Something went wrong...Please try again later!");
				res.redirect("/poetry");
			}
			else{
				//create new comment
				Comment.create(req.body.comment,function(err,comment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						//add username and id to that comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						//save comment
						poem.comments.push(comment);
						poem.save();
						req.flash("success","Successfully added a comment! Thanks for the review <3 ")
						res.redirect("/poetry/" + poem._id);
					}
				});
			}
		});
	});

//EDIT
	router.get("/poetry/:id/comments/:comment_id/edit",middleware.isCommentOwner,function(req,res){
		Poetry.findById(req.params.id,function(err,foundPoetry){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err)
					req.flash("error","Something went wrong...Please try again later!");
				else{
					res.render("comments/poetry/edit",{poetry: foundPoetry, comment: foundComment});
			}
		});
			}
		});
	});

	router.put("/poetry/:id/comments/:comment_id",middleware.isCommentOwner,function(req,res){
		Poetry.findById(req.params.id,function(err,foundPoetry){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Successfully edited your comment :D")
						res.redirect("/poetry/"+req.params.id);
					}
				});
			}
		});
	});

//DESTROY
	router.delete("/poetry/:id/comments/:comment_id",middleware.isCommentOwner,function(req,res){
		Poetry.findById(req.params.id,function(err,foundPoetry){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndRemove(req.params.comment_id,function(err){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Deleted your review! Thanks for adding it in the first place <3")
						res.redirect("/poetry/"+req.params.id);
					}
				});
			}
		});
	});


module.exports = router;