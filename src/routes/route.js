const express = require("express")
const { registerUser,loginUser } = require("../Controller/userController")
const { creatBook } = require("../Controller/bookController.js")

const route = express.Router()


route.post("/register", registerUser )
route.post("/login", loginUser )
route.post("/books", creatBook)



route.all("/*",(req,res)=>{
    console.log("Plz enter valid route");
    res.status(400).send({msg:"invalid route"})
})



module.exports = route
