const mongoose= require('mongoose');


const orderSchema= new mongoose.Schema({
    orderitem:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderitem',
        required:true
    }],
    shippingaddress1:{
        type:String,
        required:true
    },
    shippingaddress2:{  
        type:String
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    totalprice:{
        type:Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    dateordered:{
        type:Date,
        default:Date.now
    }

})


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});



exports.Order=mongoose.model('order',orderSchema,'order');