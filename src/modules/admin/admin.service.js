import userModel from "../../../DB/model/user.model.js";

export const checkIdExists = async (id) => {
    return await userModel.findById(id);
};
export const getUsersByRole = async (role) => {
    return await userModel.find({ role }).select('userName universityId email college status confirmEmail sendCode');
};
export const registerAdmin = async (userData) => {
    return await userModel.create(userData);
};
export const checkUniversityIdExists = async (universityId) => {
    return await userModel.findOne({ universityId });
};
export const checkEmailExists = async (email) => {
    return await userModel.findOne({ email });
};
