/**
 * Menu API
 */
import axiosClient from "./client";

export const getAllMenu = async (RoleId) => {
    // return await axiosClient.get("/Menu/GetMenu", { params: { RoleId } });
    return [];
};

export const getMenuService = {
    getAllMenu
};
