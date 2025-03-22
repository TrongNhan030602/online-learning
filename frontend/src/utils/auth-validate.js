export const validateName = (name) => {
  if (!name) return "Tên không được để trống.";
  if (typeof name !== "string") return "Tên phải là một chuỗi.";
  if (name.length < 3 || name.length > 50) return "Tên phải từ 3 đến 50 ký tự.";
  const nameRegex = /^[\p{L}\s\\-]+$/u;
  if (!nameRegex.test(name))
    return "Tên chỉ được chứa chữ cái, khoảng trắng và dấu '-'.";
  return "";
};

export const validateEmail = (email) => {
  if (!email) return "Email không được để trống.";
  if (typeof email !== "string") return "Email phải là một chuỗi.";
  if (email.length > 255) return "Email không được vượt quá 255 ký tự.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email không hợp lệ.";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống.";
  if (typeof password !== "string") return "Mật khẩu phải là một chuỗi.";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
  if (password.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!passwordRegex.test(password))
    return "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&).";
  return "";
};
