import axiosClient from "./axiosClient";

/* =====================================================
   SUPER ADMIN APIs
===================================================== */

// Get all hospital department mappings
export const getHospitalDepartments = () => {
    return axiosClient.get("/super-admin/hospital-departments");
};

// Create hospital department mapping
export const createHospitalDepartment = (data) => {
    return axiosClient.post(
        "/super-admin/hospital-departments",
        data
    );
};

// Update hospital department mapping
export const updateHospitalDepartment = (id, data) => {
    return axiosClient.put(
        `/super-admin/hospital-departments/${id}`,
        data
    );
};

// Delete hospital department mapping
export const deleteHospitalDepartment = (id) => {
    return axiosClient.delete(
        `/super-admin/hospital-departments/${id}`
    );
};


/* =====================================================
   CUSTOMER APIs
===================================================== */

// Get departments by hospital
export const getDepartmentsByHospital = (hospitalId) => {
    return axiosClient.get(
        `/customer/hospital-departments/hospital/${hospitalId}`
    );
};