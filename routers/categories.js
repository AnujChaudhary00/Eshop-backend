const express=require('express');
const {Category} = require('../Models/category');
const router=express.Router();

router.get('/',async (req,res)=>{
    const categoryList=await Category.find();

    if(!categoryList)
    {
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList);
})

router.get('/:id',async (req,res)=>{
    const category=await Category.findById(req.params.id);

    if(!category)
    {
        res.status(500).json({message:"The Category with the given id doesn't exist"});
    }

    res.status(200).send(category);
})

router.post(`/`,async (req,res)=>{
    let categoryObject=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })

    categoryGet=await categoryObject.save();

    if(!categoryGet)
        return res.status(404).send("the category cannot be created!");
     
    res.send(categoryGet);
})

router.delete('/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then(category=>{
        if(category)
        {
            return res.status(200).json({success:true,message:"category deleted"});
        }
        else
        {
            return res.status(404).json({success:false,messgae:"unable to delte as category does'nt exist"});
        }
    })
    .catch(err=>{
        return res.status(404).json({success:false,error:err});
    })
})

router.put('/:id',async (req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color
        },
        {
            new:true
        }
    )

    if(!category)
    {
        return res.status(404).send("the category cannot be created");
    }
        return res.send(category);
}) 

module.exports=router;