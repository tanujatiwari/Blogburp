var mongoose= require("mongoose");

var seriesSchema = new mongoose.Schema({
	title : String,
	desc : String,
	body : String,
	author :{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username : String
	},
	comments : [
		{
			 type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Series", seriesSchema);