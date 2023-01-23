const bookModel = require("../Models/bookModel")


const  mongoose  = require("mongoose")
const validator = require("validator")
const userModel = require("../Models/userModel")


let isbnRegex = /^[-][6-9][0-9]{17}$/


const creatBook = async (req,res)=>{
   try {
    let data = req.body
    if(Object.keys(data).length===0) return res.status(400).send({status:false,msg:"plz provide valid details"})
    let {title,excerpt,userId,ISBN,category,subcategory,reviews} = data
    if(!title || !excerpt || !userId || !ISBN || !category || !subcategory) return res.status(400).send({status:false,message:"all fields are mendatory"})
    if(!validator.isAlpha(title))  return res.status(400).send({status:false,msg:"plz provide valid title"})
    if(!validator.isAlpha(excerpt))  return res.status(400).send({status:false,msg:"plz provide valid excerpt"})
    if(!validator.isAlpha(category))  return res.status(400).send({status:false,msg:"plz provide valid category"})
    if(!validator.isAlpha(subcategory))  return res.status(400).send({status:false,msg:"plz provide valid subcategory"})
    if(!mongoose.isValidObjectId(userId)) return res.status(400).send({status:false,msg:"plz provide valid userId"})
    if(!isbnRegex.test(ISBN)) return res.send("invalid ISBN")
    let findUser = await userModel.findById({_id:userId})
    if(!findUser) return res.status(404).send({status:true,message:"User not found, check userId"})
    if(reviews) {
        if(typeof(reviews) != "number") return res.status(400).send({status:false,msg:"plz provide valid review"})
    }
    
    let findBook = await bookModel.findOne({title:title,ISBN:ISBN}) 
    if(findBook) return res.status(409).send({status:false,message:"given details already exist"})
    let createBook = await bookModel.create(data)
    let {__v, ...otherData} = createBook._doc
  
    res.send(otherData)
   } catch (error) {
    console.log("error in create book", error.message);
    res.send(error.message)
   }
  
}



module.exports = {creatBook}