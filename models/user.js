const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const userSchema = mongoose.Schema({
    email:{
        type:String,
       
    },
    hash: String,
    salt: String
})

userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,10);
}
userSchema.methods.validatePassword = (password)=>{
    return bcrypt.compare(password,this.password);
}

const model = mongoose.model("User",userSchema);

module.exports = model;