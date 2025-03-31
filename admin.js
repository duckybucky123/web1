document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    // Gán thông tin người dùng nếu có
    if (user.username) {
      document.getElementById("admin-name").textContent = user.username;
      document.getElementById("admin-username").value = user.username;
      document.getElementById("admin-email").value = user.email || "";
      document.getElementById("admin-dob").value = user.dob || "";
  
      if (user.avatar) {
        document.getElementById("admin-avatar").src = user.avatar;
      }
    }
  
    // Lưu thay đổi thông tin cá nhân
    const saveBtn = document.querySelector("#section-info button");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const updatedUser = {
          ...user,
          username: document.getElementById("admin-username").value,
          email: document.getElementById("admin-email").value,
          dob: document.getElementById("admin-dob").value,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("✅ Đã lưu thông tin!");
        location.reload();
      });
    }
  
    // Upload ảnh
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = () => {
          const updatedUser = {
            ...user,
            avatar: reader.result,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          document.getElementById("admin-avatar").src = reader.result;
          alert("✅ Ảnh đại diện đã được cập nhật!");
        };
        reader.readAsDataURL(file);
      });
    }
  });
  
  // Chuyển tab
  function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${id}`).classList.remove('hidden');
  }
  