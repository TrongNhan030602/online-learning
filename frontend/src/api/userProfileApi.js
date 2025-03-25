import axiosClient from "./axiosClient";

const userProfileApi = {
  getProfile: () => axiosClient.get("/profile"),
  updateProfile: (data) => axiosClient.put("/profile", data),
  updateAvatar: (formData) =>
    axiosClient.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (data) => axiosClient.post("/profile/change-password", data),
};

export default userProfileApi;
