var express= require("express");
var router  = express.Router();
var Proses = require("../../models/proses");
var Comment = require("../../models/comment");
var middleware = require("../../middleware");

//NEW
	router.get("/proses/:id/comments/new",middleware.isLoggedIn,function(req,res){
		Proses.findById(req.params.id,function(err,prose){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("comments/proses/new",{prose : prose});
		});
	});

	router.post("/proses/:id/comments",middleware.isLoggedIn,function(req,res){
		Proses.findById(req.params.id,function(err,prose){
			if(err){
				req.flash("error","Something went wrong...Please try again later!");
				res.redirect("/proses");
			}
			else{
				//create new comment
				Comment.create(req.body.comment,function(err,comment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						comment.author.id= req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						prose.comments.push(comment);
						prose.save();
						req.flash("success","Successfully added a comment! Thanks for the review <3 ")
						res.redirect("/proses/" + prose._id);
					}
				});
			}
		});
	});

//EDIT
	router.get("/proses/:id/comments/:comment_id/edit",middleware.isCommentOwner,function(req,res){
		Proses.findById(req.params.id,function(err,foundProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err)
					console.log(err)
				else{
					res.render("comments/proses/edit",{prose: foundProse, comment: foundComment});
			}
		});
			}
		});
	});

	router.put("/proses/:id/comments/:comment_id",middleware.isCommentOwner,function(req,res){
		Proses.findById(req.params.id,function(err,foundProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Successfully edited your comment :D")
						res.redirect("/proses/"+req.params.id);
					}
				});
			}
		});
	});

//DESTROY
	router.delete("/proses/:id/comments/:comment_id",middleware.isCommentOwner,function(req,res){
		Proses.findById(req.params.id,function(err,foundProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else{
				Comment.findByIdAndRemove(req.params.comment_id,function(err){
					if(err)
						req.flash("error","Something went wrong...Please try again later!");
					else{
						req.flash("success","Deleted your review! Thanks for adding it in the first place <3")
						res.redirect("/proses/"+req.params.id);
					}
				});
			}
		});
	});

module.exports = router;