import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./model/user.model.js";
export const connectDB = async () => {
     try {
          await mongoose.connect(process.env.DB);

          const adminExists = await userModel.findOne({ role: 'superAdmin' });
          if (!adminExists) {
               const adminUser = new userModel({
                    userName: "superAdmin",
                    email: process.env.AdminEmail,
                    universityId: "0000",
                    password: bcrypt.hashSync(process.env.AdminPassword, parseInt(process.env.SALTROUND)),
                    role: "superAdmin",
                    confirmEmail: true,
               });
               await adminUser.save();
          }
          console.log('MongoDB connected...');
     } catch (err) {
          console.error('Error connecting to MongoDB:', err);
     }
};
