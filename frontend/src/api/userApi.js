import axiosClient from "./axiosClient";

const userApi = {
  getProfile: () => axiosClient.get("/profile"),
  updateProfile: (data) => axiosClient.put("/profile", data),
  updateAvatar: (formData) =>
    axiosClient.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default userApi;
