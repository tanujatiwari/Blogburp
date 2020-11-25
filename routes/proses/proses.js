var express= require("express");
var router  = express.Router();
var Proses = require("../../models/proses");
var middleware = require("../../middleware");

//INDEX
	router.get("/proses",function(req,res){
		Proses.find({},function(err, proses){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("proses/index",{proses : proses});
		});
	});

//NEW and CREATE

	router.get("/proses/new",middleware.isDeveloper,function(req,res){
		res.render("proses/new");
	});
	
	router.post("/proses",middleware.isDeveloper,function(req,res){
		var title = req.body.prose.title;
		var desc = req.body.prose.title;
		var body = req.body.prose.body;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newProse = {title : title, desc:desc,body:body,author:author};
		Proses.create(newProse,function(err,newProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/proses");
		});
	});

//SHOW
	router.get("/proses/:id",function(req,res){
		Proses.findById(req.params.id).populate("comments").exec(function(err,foundProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.render("proses/show",{prose:foundProse});
		});
	});

//EDIT and UPDATE
	router.get("/proses/:id/edit",middleware.isProseOwner,function(req,res){
		Proses.findById(req.params.id,function(err,updateProse){
			res.render("proses/edit",{prose:updateProse});
		});
	});

	router.put("/proses/:id",middleware.isProseOwner,function(req,res){
		Proses.findByIdAndUpdate(req.params.id,req.body.prose,function(err,updatedProse){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/proses/"+req.params.id);
		});
	});

//DESTROY
	router.delete("/proses/:id",middleware.isProseOwner,function(req,res){
		Proses.findByIdAndDelete(req.params.id,function(err){
			if(err)
				req.flash("error","Something went wrong...Please try again later!");
			else
				res.redirect("/proses")
		});
	});

module.exports = router;