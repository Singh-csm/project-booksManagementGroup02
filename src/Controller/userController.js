const userModel = require("../Models/userModel");
const validator = require("validator");
const JWT= require("jsonwebtoken");


const registerUser = async (req,res)=>{
    try {
        let data = req.body

        if(Object.keys(data).length===0) return res.status(400).send({msg:"plz provide valid data"})

        let validateMobile = /^[6-9][0-9]{9}$/
   
        let validTitle = ["Mr","Mrs","Miss"] 

        let {title,name,phone,email,password}= data

        if(!title) return res.status(400).send({status:false,msg:"Title is mendatory"})
        if(!validTitle.includes(title)) return res.status(400).send({status:false,msg:"plz provide valid title"})

        if(!name) return res.status(400).send({status:false,msg:"name is mendatory"})
        if(!validator.isAlpha(name.split(" ").join(""))) return res.status(400).send({status:false,msg:"plz enter valid name"})
        
        if(!phone) return res.status(400).send({status:false,msg:"phone is mendatory"})
        if(!validateMobile.test(phone)) return res.status(400).send({status:false,msg:"plz enter valid mobile number"})
        
        if(!email) return res.status(400).send({status:false,msg:"email is mendatory"})
        if(!validator.isEmail(email)) return res.status(400).send({status:false,msg:"plz enter valid email"})
        
        if(!password) return res.status(400).send({status:false,msg:"password is mendatory"})
        if(!validator.isStrongPassword(password)) return res.status(400).send({status:false,msg:"plz enter valid password"})

        let checkDublicate = await userModel.findOne({email:email,phone:phone})
        if(checkDublicate) return res.status(409).send({status:false,msg:"user alredy exist"})

        let createUser = await userModel.create(data)
        res.status(201).send({status:true,msg:"success",data:createUser})

    } catch (error) {
        console.log("error in registerUser", error.message);
        res.send(error.message)
    }
}


const loginUser = async(req,res)=>{
   try {
    let data = req.body

    if(Object.keys(data).length===0) return res.status(400).send({msg:"plz provide valid credentials"})

    let {email,password} = data

    if(!email) return res.status(400).send({ status: false, message: "email is missing" })
    if(!validator.isEmail(email)) return res.status(400).send({status:false,msg:"Invalid email"})

    if(!password) return res.status(400).send({ status: false, message: "password is missing" })
    if(!validator.isStrongPassword(password)) return res.status(400).send({status:false,msg:"Invalid password"})

    let findUser = await userModel.findOne({email:email,password:password})
    if(!findUser) return res.status(404).send({status:false,msg:"user not found"})

    let userId = findUser._id.toString()

    let token = JWT.sign({userId:userId},"group2project-4",{
        expiresIn:10,
    })
    let dekodetoken = JWT.verify(token,"group2project-4" )

    let iat = dekodetoken.iat
    let id = dekodetoken.userId
    let exp = dekodetoken.exp
   
    res.setHeader("token",token)
    res.send({status:true,message:"Login scuccess",data:{token,id,iat,exp}})
   } catch (error) {
    console.log("error in loginUser", error.message);
   }

}





module.exports = {registerUser,loginUser}