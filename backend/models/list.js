const mongoose = require ("mongoose");
const user = require("./user");
const listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },

    user: [
         {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
    ],
})

module.exports = mongoose.model("List",listSchema);