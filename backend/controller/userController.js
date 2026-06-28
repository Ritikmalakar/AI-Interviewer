import User from "../models/userModels.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export async function register(req,res){
try{
const {...formData}=req.body;
if(!formData.name||!formData.email||!formData.password){
  return res.status(400).send({
    success:false,
    message:"all fields required"
  })
}
const existUser=await User.findOne({email:formData.email})
if(existUser){
  return res.status(400).send({
    success:false,
    message:"user already register"
  })
}
formData.password=await bcrypt.hash(formData.password,10);
const user=await User.create(formData);
res.status(200).send({
  success:true,
  message:"register successfully",
  user
})
}catch(error){
  console.log(error);
  res.status(500).send({
    success:false,
    message:error.message,
    error
  })
}
}






export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
}
export async function logout(req,res){
  try{
res.clearCookie();
res.status(200).send({
  success:true,
  message:"logout successfully"
})
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:error.message,
      error
    })
  }
}