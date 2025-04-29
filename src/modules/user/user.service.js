import userModel from "../../../DB/model/user.model.js";

export const checkIdExists = async (id) => {
    return await userModel.findById(id).select('userName universityId email bio profileImage');
};