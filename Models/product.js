const mongoose=require('mongoose');


const productSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    richdescription:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    images:[{
        type:String,
    }],
    brand:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
    category:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    countinstock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    rating:{
        type:Number,
        default:0
    },
    numreview:
    {
        type:Number,
        default:0
    },
    isfeatured:{
        type:Boolean,
        default:false
    },
    datecreated:{
        type:Date,
        default:Date.now
    }
});


productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});



exports.product=mongoose.model('product',productSchema,'product');