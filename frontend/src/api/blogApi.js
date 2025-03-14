import axiosClient from "./axiosClient";

const blogApi = {
  getBlogs: () => axiosClient.get("/blogs"),
  getBlogDetail: (id) => axiosClient.get(`/blogs/${id}`),
  createBlog: (data) => axiosClient.post("/blogs", data),
  updateBlog: (id, data) => axiosClient.put(`/blogs/${id}`, data),
  deleteBlog: (id) => axiosClient.delete(`/blogs/${id}`),

  uploadImages: (blogId, images) => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images[]", image));

    return axiosClient.post(`/blogs/${blogId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getImages: (blogId) => axiosClient.get(`/blogs/${blogId}/images`),
  deleteImage: (imageId) => axiosClient.delete(`/blogs/images/${imageId}`),

  getComments: (blogId) => axiosClient.get(`/blog-comments/${blogId}`),
  addComment: (data) => axiosClient.post("/blog-comments", data),
  updateComment: (id, data) => axiosClient.put(`/blog-comments/${id}`, data),
  deleteComment: (id) => axiosClient.delete(`/blog-comments/${id}`),
};

export default blogApi;
