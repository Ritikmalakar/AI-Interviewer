import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import { connectDb } from './config/db.js';
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import cookieParser from 'cookie-parser'
const app=express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin:process.env.USER_SECRET,
  credentials:true
}))
app.use("/user",userRoutes)
app.use('/interview',interviewRoutes)
async function serverStart() {
  try{
await connectDb();
app.listen(process.env.PORT,()=>{
  console.log("server start")
})

  }catch(error){
    console.log(error)
  }
}
serverStart();