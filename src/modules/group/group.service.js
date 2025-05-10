import groupModel from "../../../DB/model/group.model.js"

export const checkNameExist = async (name) => {
    return await groupModel.findOne({ name });
}
export const createdGroup = async (data) => {
    await groupModel.create(data);
}
export const findGroupById = async (id) => {
    return await groupModel.findById(id);
};
export const updateGroupById = async (id, data) => {
    return await groupModel.findByIdAndUpdate(id, data);
};