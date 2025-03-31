document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    if (!form) return;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const username = formData.get("username").trim();
      const email = formData.get("email").trim();
      const password = formData.get("password");
      const dob = formData.get("dob");
      const avatarFile = formData.get("avatar");
  
      if (!username || !email || !password || !dob) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
  
      const user = { username, email, password, dob };
  
      const complete = (avatar) => {
        if (avatar) user.avatar = avatar;
  
        const users = JSON.parse(localStorage.getItem("users") || "[]");
  
        if (users.some(u => u.username === username)) {
          alert("⚠️ Tên đăng nhập đã tồn tại!");
          return;
        }
  
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
  
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", JSON.stringify(user));
  
        alert("🎉 Đăng ký & đăng nhập thành công!");
        window.location.href = "index.html";
      };
  
      if (avatarFile && avatarFile.size > 0) {
        const reader = new FileReader();
        reader.onload = () => complete(reader.result);
        reader.readAsDataURL(avatarFile);
      } else {
        complete(null);
      }
    });
  });
  