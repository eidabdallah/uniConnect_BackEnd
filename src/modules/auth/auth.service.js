import userModel from "../../../DB/model/user.model.js";

export const checkEmailExists = async (email) => {
    return await userModel.findOne({ email });
};
export const checkUniversityIdExists = async (universityId) => {
    return await userModel.findOne({ universityId });
};
export const registerUser = async (userData) => {
    return await userModel.create(userData);
};
export const confirmUserEmail = async (email) => {
    return await userModel.findOneAndUpdate({ email }, { confirmEmail: true }, { new: true });
};