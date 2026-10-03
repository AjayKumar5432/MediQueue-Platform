import axiosClient from "./axiosClient";

/* ===========================
   SUPER ADMIN APIs
=========================== */

export const getHospitals = () => {
    return axiosClient.get("/super-admin/hospitals");
};

export const createHospital = (data) => {
    return axiosClient.post("/super-admin/hospitals", data);
};

export const updateHospital = (id, data) => {
    return axiosClient.put(`/super-admin/hospitals/${id}`, data);
};

export const deleteHospital = (id) => {
    return axiosClient.delete(`/super-admin/hospitals/${id}`);
};

export const toggleHospitalStatus = (id) => {
    return axiosClient.put(`/super-admin/hospitals/${id}/toggle-status`);
};


/* ===========================
   CUSTOMER APIs
=========================== */

export const getCustomerHospitals = () => {
    return axiosClient.get("/customer/hospitals");
};