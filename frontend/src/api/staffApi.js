import axiosClient from "./axiosClient";


const BASE_URL = "/hospital-admin/staff";


export const getStaff = () => {
    return axiosClient.get(BASE_URL);
};


export const createStaff = (data) => {
    return axiosClient.post(BASE_URL, data);
};


export const updateStaff = (id, data) => {
    return axiosClient.put(
        `${BASE_URL}/${id}`,
        data
    );
};


export const deleteStaff = (id) => {
    return axiosClient.delete(
        `${BASE_URL}/${id}`
    );
};