const mongoose = require('mongoose');



const schemaProducts = new mongoose.Schema({
    image:{type:String,required:true},
    title:{type:String, required:true },
    description:{type:String, required:true },
    price:{type:Number,required:true}
})

const product = mongoose.model("products",schemaProducts);

module.exports = product;