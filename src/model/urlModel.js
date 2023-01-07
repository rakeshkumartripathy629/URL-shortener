const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl :{
        type: String,
        unique :true,
        required: true
    },
    urlCode: {
        type: String,
        required: true,
        unique: true,
        // lowercase: true
    }

},{timestamps:true})

module.exports = mongoose.model('Url' , urlSchema)