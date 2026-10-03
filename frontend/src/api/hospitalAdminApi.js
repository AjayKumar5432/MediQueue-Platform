import axiosClient from "./axiosClient";

export const getHospitalAdmins = () => {
    return axiosClient.get("/super-admin/hospital-admins");
};

export const createHospitalAdmin = (data) => {
    return axiosClient.post("/super-admin/hospital-admins", data);
};

export const updateHospitalAdmin = (id, data) => {
    return axiosClient.put(
        `/super-admin/hospital-admins/${id}`,
        data
    );
};

export const deleteHospitalAdmin = (id) => {
    return axiosClient.delete(
        `/super-admin/hospital-admins/${id}`
    );
};

export const approveHospitalAdmin = (id) => {
    return axiosClient.put(
        `/super-admin/hospital-admins/${id}/approve`
    );
};

export const rejectHospitalAdmin = (id) => {
    return axiosClient.put(
        `/super-admin/hospital-admins/${id}/reject`
    );
};