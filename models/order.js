var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    contact_no:{type:Number,required: true},
    paymentId: {type: String, required: true}
});

const order = mongoose.model("order",schema);

module.exports =order;