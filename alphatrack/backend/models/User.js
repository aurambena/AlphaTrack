import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    id : {type : String, default: uuidv4, required: true, unique: true}, //install npm i uuid, allows to generate diffetenst id for safety
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true, lowercase : true, trim : true},
    password : {type: String, required: true, minLength : 8},
},
{
    //JSON to send when it is asked for safety
    toJSON: {
        transform: function(doc, ret){
          delete ret.__v;
          delete ret.__id;
          delete ret.password;
        },
        virtuals: true,
    },
})

//before save
//to encrypt passwords npm install bcrypt
userSchema.pre('save', async function (next){
    //if password have been modified
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//index field
userSchema.index({id:1, email:1 });

//user Object
const User = mongoose.model("User", userSchema);

export default User;