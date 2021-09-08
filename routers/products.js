const express=require('express');
const  mongoose  = require('mongoose')
const { Category } = require('../Models/category');
const {product} = require('../Models/product');
const router=express.Router();
const multer= require('multer');


const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        const isValid=FILE_TYPE_MAP[file.mimetype];
        let uploaderror=new Error('invalid image type');
        if(isValid)
        {
            uploaderror=null;
        }
        cb(uploaderror,'public/upload')
    },
    filename:function (req,file,cb){
        const filename=file.originalname.split(' ').join('-');
        const extension=FILE_TYPE_MAP[file.mimetype]
        cb(null,`${filename}-${Date.now()}.${extension}`)
    }
});

const uploadOptions=multer({storage:storage});

router.get('/',async (req,res)=>{
    const productList=await product.find();

    if(!productList)
    {
        res.status(500).json({success:false})
    }
    res.status(200).send(productList);
});


router.get('/byCategory',async (req,res)=>{

    let filter={};
    if(req.query.categories)
    {
        filter={category:req.query.categories.split(',')};
    }
    const productList=await product.find(filter).populate('category');

    if(!productList)
    {
        res.status(500).json({success:false})
    }
    res.status(200).send(productList);
});

router.get('/name&image',async (req,res)=>{
    const productList=await product.find().select('name image -_id');

    if(!productList)
    {
        res.status(500).json({success:false})
    }
    res.status(200).send(productList);
})

router.get('/:id',async (req,res)=>{
    const productList=await product.findById(req.params.id).populate('category');

    if(!productList)
    {
        res.status(500).json({message:"The product with the given id doesn't exist"});
    }

    res.status(200).send(productList);
})


router.post(`/`,uploadOptions.single('image'),async (req,res)=>{

    const filename=req.file.filename;
    const basePath=`${req.protocol}://${req.get('host')}/public/upload/`;
    const category=await Category.findById(req.body.category);
    const file=req.file;

    if(!file) return res.status(400).send("No image in the request");
    if(!category) return res.status(400).send('Invalid Category');

    const productObj=new product({
        name:req.body.name,
        description:req.body.description,
        richdescription:req.body.richdescription,
        image:`${basePath}${filename}`,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countinstock:req.body.countinstock,
        rating:req.body.rating,
        numreview:req.body.numreview,
        isfeatured:req.body.isfeatured    
    })
    productget=await productObj.save();
    
    if(!product)
    {
        return res.status(500).send("The product cannot be created");
    }

    res.status(200).send(productget);
});

router.put('/gallery-images/:id',uploadOptions.array('images',10),async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id))
    {
        return res.status(400).send('Invalid Product id');
    }
    const files=req.files;
    let imagesPaths=[];
    const basePath=`${req.protocol}://${req.get('host')}/public/upload/`;

    if(files)
    {
        files.map(file=>{
            imagesPaths.push(`${basePath}${file.filename}`)
        })
    }
    const productObj=await product.findByIdAndUpdate(
        req.params.id,
        {
        images:imagesPaths,
        },
        {new:true}
    );

    if(!productObj)
    {
        return res.status(500).send('The Product cannot be updates');
    }

    res.send(productObj);
   
})


router.delete('/:id', (req,res)=>{
    product.findByIdAndRemove(req.params.id)
    .then(product=>{
        if(product)
        {
            return res.status(200).json({success:true,message:"product deleted"});
        }
        else
        {
            return res.status(404).json({success:false,messgae:"unable to delete as product does'nt exist"});
        }
    })
    .catch(err=>{
        return res.status(404).json({success:false,error:err});
    })
});

router.get('/get/count',async (req,res)=>{
    const productCount=await product.countDocuments((count)=>count)

    if(!productCount)
    {
        res.status(500).json({success:false})
    }
    res.send({
        productCount:productCount
    });
})


router.get('/get/featured',async (req,res)=>{
    const count=req.params.count?req.params.count:0;
    const featuredProduct=await product.find({isfeatured:true}).limit(+count);

    if(!featuredProduct)
    {
        res.status(500).json({success:false})
    }
    res.send({
        featuredProduct
    });
})


router.put('/:id',uploadOptions.single('image'),async (req,res)=>{
    console.log(req.body);

    if(!mongoose.isValidObjectId(req.params.id))
    {
        res.status(400).send("Inavlid Product Id");
    }
    
    const category=await Category.findById(req.body.category);

    if(!category) {
        co
        return res.status(400).send('Invalid Category')};
   
    const productlist=await product.findById(req.params.id);
  
    if(!product){ 
        return res.status(400).send("Invalid product")};
  
    const file=req.file;
    let imagepath;
   
    if(file)
    {
        
        const filename=file.filename;
        const basepath=`${req.protocol}://${req.get('host')}/public/upload/`;
        imagepath=`${basepath}${filename}`;
       
    }else
    {
       
        imagepath=productlist.image;
    }
    
    const productObj=await product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richdescription:req.body.richdescription,
            image:imagepath,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countinstock:req.body.countinstock,
            rating:req.body.rating,
            numreview:req.body.numreview,
            isfeatured:req.body.isfeatured    
        },
        {
            new:true
        }
    )
   

    if(!productObj)
    {
        
        return res.status(404).send("the product cannot be created");
    }
    
        return res.status(200).send(productObj);
}) 


module.exports=router;