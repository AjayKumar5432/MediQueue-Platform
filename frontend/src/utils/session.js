export const saveSession = (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("email", user.email);
    localStorage.setItem("fullName", user.fullName);
    if (user.status) localStorage.setItem("status", user.status);
    if (user.hospitalId) localStorage.setItem("hospitalId", user.hospitalId);
    if (user.hospitalDepartmentId) localStorage.setItem("hospitalDepartmentId", user.hospitalDepartmentId);
    if (user.departmentName) localStorage.setItem("departmentName", user.departmentName);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getFullName = () => {
    return localStorage.getItem("fullName");
};

export const updateSessionFullName = (fullName) => {
    if (fullName) localStorage.setItem("fullName", fullName);
};

export const getStatus = () => {
    return localStorage.getItem("status");
};

export const getHospitalId = () => {
    return localStorage.getItem("hospitalId");
};

export const getHospitalDepartmentId = () => {
    return localStorage.getItem("hospitalDepartmentId");
};

export const getDepartmentName = () => {
    return localStorage.getItem("departmentName");
};

export const isLoggedIn = () => {
    return getToken() !== null;
};

export const logout = () => {
    localStorage.clear();
};