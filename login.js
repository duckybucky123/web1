document.addEventListener("DOMContentLoaded", () => {
    // ✅ Thêm user mẫu nếu chưa có
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const defaultUser = {
      username: "admin",
      password: "123456",
      email: "admin@book.com",
      dob: "2000-01-01",
      fullName: "Quản trị viên",
      avatar: null,
    };
    if (!users.some(u => u.username === "admin")) {
      users.push(defaultUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  
    const form = document.getElementById("login-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
  
      const userList = JSON.parse(localStorage.getItem("users") || "[]");
  
      const matchedUser = userList.find(
        (u) => u.username === username && u.password === password
      );
  
      if (!matchedUser) {
        alert("❌ Tên đăng nhập hoặc mật khẩu không đúng!");
        return;
      }
  
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", JSON.stringify(matchedUser));
  
      alert("🎉 Đăng nhập thành công!");
      window.location.href = "index.html";
    });
  });
  