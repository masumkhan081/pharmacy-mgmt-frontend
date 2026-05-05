import apiClient from "./apiClient";

export const getHandler = (endpoint) => apiClient.get(endpoint);
export const postHandler = (endpoint, body) => apiClient.post(endpoint, body);
export const patchHandler = (endpoint, body) => apiClient.patch(endpoint, body);
export const deleteHandler = (endpoint) => apiClient.delete(endpoint);

export default apiClient;
