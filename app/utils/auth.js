"use client";

// Lưu trữ thông tin người dùng trong localStorage
const STORAGE_KEY = "yolo_home_user";
const DEMO_USERNAME = "demo123";

// Hàm đăng nhập
export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Tài khoản demo luôn đăng nhập thành công
      if (username === DEMO_USERNAME) {
        const user = {
          id: "demo_id",
          username: username,
          name: "Demo User",
          email: "demo@example.com",
          role: "user"
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
        return;
      }

      // Kiểm tra người dùng đã đăng ký trong localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
      const foundUser = registeredUsers.find(user =>
        user.username === username && user.password === password
      );

      if (foundUser) {
        const { password, ...userInfo } = foundUser; // Loại bỏ mật khẩu khỏi thông tin người dùng
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
        resolve(userInfo);
      } else {
        reject(new Error("Tên đăng nhập hoặc mật khẩu không chính xác"));
      }
    }, 800); // Giả lập độ trễ mạng
  });
};

// Hàm đăng nhập bằng khuôn mặt
export const loginWithFace = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // Demo user
      if (userId === "demo_id") {
        const user = {
          id: "demo_id",
          username: DEMO_USERNAME,
          name: "Demo User",
          email: "demo@example.com",
          role: "user"
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
        return;
      }

      // Tìm người dùng theo ID
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
      const foundUser = registeredUsers.find(user => user.id === userId);

      if (foundUser) {
        const { password, ...userInfo } = foundUser; // Loại bỏ mật khẩu khỏi thông tin người dùng
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
        resolve(userInfo);
      } else {
        reject(new Error("Người dùng không tồn tại"));
      }
    }, 800); // Giả lập độ trễ mạng
  });
};

// Hàm đăng ký
export const register = (name, username, email, password, faceDescriptor = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Kiểm tra xem tên người dùng hoặc email đã tồn tại chưa
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");

      if (username === DEMO_USERNAME) {
        reject(new Error("Tên đăng nhập này đã được sử dụng"));
        return;
      }

      const existingUser = registeredUsers.find(user =>
        user.username === username || user.email === email
      );

      if (existingUser) {
        reject(new Error("Tên đăng nhập hoặc email đã tồn tại"));
        return;
      }

      const newUserId = Date.now().toString();

      // Tạo người dùng mới
      const newUser = {
        id: newUserId,
        name,
        username,
        email,
        password,
        role: "user",
        hasFaceAuth: faceDescriptor !== null
      };

      // Thêm vào danh sách người dùng đã đăng ký
      registeredUsers.push(newUser);
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers));

      // Lưu thông tin khuôn mặt nếu có
      if (faceDescriptor) {
        try {
          // Lưu thông tin khuôn mặt vào face_data
          const savedFaces = JSON.parse(localStorage.getItem('face_data') || '{}');
          savedFaces[newUserId] = Array.from(faceDescriptor);
          localStorage.setItem('face_data', JSON.stringify(savedFaces));
        } catch (error) {
          console.error('Error saving face data:', error);
        }
      }

      // Đăng nhập người dùng mới
      const { password: _, ...userInfo } = newUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      resolve(userInfo);
    }, 1000); // Giả lập độ trễ mạng
  });
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Hàm kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Hàm kiểm tra email hợp lệ
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
