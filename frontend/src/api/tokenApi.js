import axiosClient from "./axiosClient";

/**
 * Book Token
 */
export const bookToken = (data) => {
    return axiosClient.post(
        "/customer/tokens/book",
        data
    );
};

/**
 * Get My Tokens
 */
export const getMyTokens = () => {
    return axiosClient.get(
        "/customer/tokens"
    );
};

/**
 * Get Token By Id
 */
export const getTokenById = (tokenId) => {
    return axiosClient.get(
        `/customer/tokens/${tokenId}`
    );
};

/**
 * Cancel Token
 */
export const cancelToken = (tokenId) => {
    return axiosClient.put(
        `/customer/tokens/cancel/${tokenId}`
    );
};