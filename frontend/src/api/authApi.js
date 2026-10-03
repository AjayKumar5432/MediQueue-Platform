import axiosClient from "./axiosClient";

export const login = (loginData) => {
    return axiosClient.post("/auth/login", loginData);
};

export const register = (registerData) => {
    return axiosClient.post("/users/register", registerData);
};

export const registerHospitalAdmin = (hospitalAdminData) => {
    return axiosClient.post("/auth/register-hospital-admin", hospitalAdminData);
};

export const registerHospital = (hospitalData) => {
    return axiosClient.post("/auth/register-hospital", hospitalData);
};


export const sendForgotPasswordOtp = (email) => {
    return axiosClient.post("/auth/forgot-password/send-otp", { email });
};

export const resetPasswordWithOtp = (email, otp, newPassword) => {
    return axiosClient.post("/auth/forgot-password/reset", { email, otp, newPassword });
};
