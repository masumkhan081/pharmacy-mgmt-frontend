import apiClient from "./apiClient";

export const getHandler = (endpoint, options) => apiClient.get(endpoint, options);
export const postHandler = (endpoint, body, options) =>
  apiClient.post(endpoint, body, options);
export const patchHandler = (endpoint, body, options) =>
  apiClient.patch(endpoint, body, options);
export const deleteHandler = (endpoint, options) =>
  apiClient.delete(endpoint, options);

export default apiClient;
