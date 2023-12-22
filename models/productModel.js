const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    }
},{timestamps:true})

module.exports = mongoose.model('items', itemSchema)