import axiosClient from "./axiosClient";

const faqApi = {
  getFaqs: () => axiosClient.get("/faqs"),
  getFaqById: (id) => axiosClient.get(`/faqs/${id}`),
  getFaqByCategory: (category) => axiosClient.get(`/faqs/category/${category}`),
  getFaqByStatus: (status) => axiosClient.get(`/faqs/status/${status}`),
  createFaq: (data) => axiosClient.post("/faqs", data),
  updateFaq: (id, data) => axiosClient.put(`/faqs/${id}`, data),
  deleteFaq: (id) => axiosClient.delete(`/faqs/${id}`),
};

export default faqApi;
