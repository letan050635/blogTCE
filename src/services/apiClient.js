import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute =
      config.url.includes("/admin/") ||
      (config.url.includes("/auth/users") &&
        (config.method !== "get" || config.url !== "/auth/users/me")) ||
      ((config.url.includes("/notifications") ||
        config.url.includes("/regulations")) &&
        (config.method === "post" ||
          config.method === "put" ||
          config.method === "delete") &&
        !config.url.includes("/read-status") &&
        !config.url.includes("/mark-all-read"));

    if (isAdminRoute) {
      // Sử dụng admin token
      const token = localStorage.getItem("admin_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Sử dụng user token
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Kiểm tra xem lỗi từ API admin hay user
      const isAdminRoute =
        error.config.url.includes("/admin/") ||
        (error.config.url.includes("/auth/users") &&
          error.config.url !== "/auth/users/me") ||
        ((error.config.url.includes("/notifications/") ||
          error.config.url.includes("/regulations/")) &&
          (error.config.method === "post" ||
            error.config.method === "put" ||
            error.config.method === "delete"));

      if (isAdminRoute) {
        localStorage.removeItem("admin_auth_token");
        localStorage.removeItem("admin_auth_user");

        if (
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href =
            "/admin/login?redirect=" + window.location.pathname;
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login?redirect=" + window.location.pathname;
        }
      }
    }

    // Xử lý và trả về thông báo lỗi cụ thể nếu có
    let errorMessage = "Đã xảy ra lỗi";

    if (error.response) {
      // Lỗi từ server (có response)
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Lỗi: ${error.response.status} - ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Không nhận được response
      errorMessage = "Không thể kết nối đến máy chủ";
    } else {
      // Lỗi trong quá trình thiết lập request
      errorMessage = error.message;
    }

    // Tạo đối tượng lỗi mới với thông báo
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
