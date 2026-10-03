import axiosClient from "./axiosClient";

const BASE_URL = "/staff/queue";

export const getTodayQueue = (hospitalDepartmentId) =>
    axiosClient.get(`${BASE_URL}/${hospitalDepartmentId}`);

export const getCurrentServingToken = (hospitalDepartmentId) =>
    axiosClient.get(`${BASE_URL}/current/${hospitalDepartmentId}`);

export const callNextToken = (hospitalDepartmentId) =>
    axiosClient.put(`${BASE_URL}/call-next/${hospitalDepartmentId}`);

export const completeToken = (tokenId) =>
    axiosClient.put(`${BASE_URL}/complete/${tokenId}`);

export const issueWalkInToken = (data) =>
    axiosClient.post(`${BASE_URL}/walk-in`, data);

export const updateTokenPriority = (tokenId, priority) =>
    axiosClient.put(`${BASE_URL}/${tokenId}/priority?priority=${priority}`);

