import mongoose from "mongoose";
// import userModel from "./models/user.model.js";
// import bcrypt from "bcryptjs";
export const connectDB = async () => {
     try {
          await mongoose.connect(process.env.DB);

        //   const adminExists = await userModel.findOne({ role: 'admin' });
        //   if (!adminExists) {
        //        const adminUser = new userModel({
        //             userName: "Admin",
        //             email: process.env.AdminEmail,
        //             universityId:"0000",
        //             password: bcrypt.hashSync(process.env.AdminPassword, parseInt(process.env.SALTROUND)),
        //             role: "admin",
        //             confirmEmail: true,
        //        });

        //        await adminUser.save();
        //   }
          console.log('MongoDB connected...');
     } catch (err) {
          console.error('Error connecting to MongoDB:', err);
     }
};
