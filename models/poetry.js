var mongoose= require("mongoose");

var poetrySchema = new mongoose.Schema({
	title : String,
	quote : String,
	poem : String,
	author :{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username : String
	},
	 comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports= mongoose.model("Poetry", poetrySchema);