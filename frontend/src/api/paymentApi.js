import axiosClient from "./axiosClient";

const BASE_URL = "/customer/payments";

export const createPaymentOrder = (data) =>
    axiosClient.post(`${BASE_URL}/create-order`, data);

export const verifyPaymentAndBookToken = (data) =>
    axiosClient.post(`${BASE_URL}/verify`, data);

export const getPaymentByTokenId = (tokenId) =>
    axiosClient.get(`${BASE_URL}/token/${tokenId}`);

export const getMyPaymentHistory = () =>
    axiosClient.get(`${BASE_URL}/history`);

export const recordCashPayment = (data) =>
    axiosClient.post("/staff/payments/record-cash", data);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getPaymentReceiptPdfUrl = (paymentId) =>
    `${API_BASE}/customer/payments/${paymentId}/pdf`;
