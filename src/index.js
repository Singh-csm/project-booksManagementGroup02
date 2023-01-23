const express = require("express")
const  mongoose  = require("mongoose")
mongoose.set('strictQuery', false);
const dotenv = require("dotenv").config()
const route = require("./routes/route.js")


const url = process.env.dbConnection
const PORT = process.env.port || 3000

const app = express()

app.use(express.json())

app.use("/", route)

const dbconnection = async (url)=>{
   try {
    mongoose.connect(url,{useNewUrlParser:true})
    console.log("Database connect");
   } catch (error) {
    console.log("error while db connection", error.message);
   }
}

dbconnection(url)

app.listen(PORT ,()=>{
    console.log(`server start on port ${PORT}`);
})