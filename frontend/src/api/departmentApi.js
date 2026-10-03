import axiosClient from "./axiosClient";

export const getDepartments = () => {
    return axiosClient.get("/super-admin/departments");
};

export const createDepartment = (department) => {
    return axiosClient.post("/super-admin/departments", department);
};

export const updateDepartment = (id, department) => {
    return axiosClient.put(`/super-admin/departments/${id}`, department);
};

export const deleteDepartment = (id) => {
    return axiosClient.delete(`/super-admin/departments/${id}`);
};