import axiosClient from "./axiosClient";

const learningResultApi = {
  getAll: (params) => axiosClient.get("/learning-results", { params }),

  getById: (id) => axiosClient.get(`/learning-results/${id}`),

  delete: (id) => axiosClient.delete(`/learning-results/${id}`),

  getByStudent: ({ studentTrainingProgramId, programId, semesterId = null }) =>
    axiosClient.get("/learning-results/by-student", {
      params: {
        student_training_program_id: studentTrainingProgramId,
        program_id: programId,
        semester_id: semesterId,
      },
    }),

  getMyLearningResult: () => axiosClient.get("/learning-results/me"),

  getByProgram: ({ programId, semesterId = null, filters = {} }) =>
    axiosClient.get("/learning-results/by-program", {
      params: {
        program_id: programId,
        semester_id: semesterId,
        ...filters,
      },
    }),
  getByProgramUser: ({ programId, userId }) =>
    axiosClient.get("/learning-results/by-program-user", {
      params: {
        program_id: programId,
        user_id: userId,
      },
    }),

  calculateAverage: ({
    studentTrainingProgramId,
    programId,
    semesterId = null,
  }) =>
    axiosClient.post("/learning-results/calculate-average", {
      student_training_program_id: studentTrainingProgramId,
      program_id: programId,
      semester_id: semesterId,
    }),

  calculateGPA: ({ studentTrainingProgramId, programId, semesterId = null }) =>
    axiosClient.post("/learning-results/calculate-gpa", {
      student_training_program_id: studentTrainingProgramId,
      program_id: programId,
      semester_id: semesterId,
    }),

  recalculateAll: ({ programId, semesterId = null }) =>
    axiosClient.post("/learning-results/recalculate", {
      program_id: programId,
      semester_id: semesterId,
    }),

  recalculateOverall: (programId) =>
    axiosClient.post("/learning-results/recalculate-overall", {
      program_id: programId,
    }),

  classify: (averageScore) =>
    axiosClient.post("/learning-results/classify", {
      average_score: averageScore,
    }),

  getReport: (criteria) =>
    axiosClient.get("/learning-results/report", {
      params: criteria,
    }),
};

export default learningResultApi;
