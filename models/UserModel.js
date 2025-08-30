import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
})

userSchema.methods.sendMail = ()=>{
    console.log("TODO");
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;