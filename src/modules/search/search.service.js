import userModel from "../../../DB/model/user.model.js";
import groupModel from './../../../DB/model/group.model.js';


export const searchUsersAndGroups = async (query) => {
    const regex = new RegExp(query, 'i');

    const users = await userModel.find({ userName: regex }).select('userName slug profileImage');
    const groups = await groupModel.find({ name: regex }).select('name slug image');

    return { users, groups };
};
