import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { searchUsersAndGroups } from "./search.service.js";


export const search = async (req, res, next) => {
    const { search } = req.query;
    const result = await searchUsersAndGroups(search);

    const response = new AppResponse("Search results fetched successfully", result, 200, 'search');
    return globalSuccessHandler(response, req, res);
};
