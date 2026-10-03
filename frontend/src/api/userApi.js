import axiosClient from "./axiosClient";

export const getMyProfile = () =>
    axiosClient.get("/users/me");

export const updateMyProfile = (data) =>
    axiosClient.put("/users/me", data);

export const changePassword = (data) =>
    axiosClient.put("/users/me/password", data);
