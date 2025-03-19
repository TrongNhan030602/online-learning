import axiosClient from "./axiosClient";

const chatApi = {
  getStudentsWhoChatted: () => axiosClient.get("/students"),
  getMessages: () => axiosClient.get("/messages"),
  sendMessage: (data) => axiosClient.post("/messages", data),
  getCurrentUser: () => axiosClient.get("/auth/me"),
};
export default chatApi;
