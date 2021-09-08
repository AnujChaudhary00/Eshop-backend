const mongoose= require('mongoose');


const orderItemSchema= new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
    
})



orderItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderItemSchema.set('toJSON', {
    virtuals: true,
});



exports.OrderItem=mongoose.model('orderitem',orderItemSchema,'orderitem')