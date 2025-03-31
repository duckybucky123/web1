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
      const headerAvatar = document.getElementById("header-avatar");
      if (headerAvatar) headerAvatar.src = user.avatar;
    }
  }

  let avatarChanged = false;
  let avatarBase64 = user.avatar || null;

  const fileInput = document.getElementById("avatar-upload");
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        avatarChanged = true;
        avatarBase64 = reader.result;
        document.getElementById("admin-avatar").src = avatarBase64;
        const headerAvatar = document.getElementById("header-avatar");
        if (headerAvatar) headerAvatar.src = avatarBase64;
      };
      reader.readAsDataURL(file);
    });
  }

  const saveBtn = document.querySelector("#section-info button");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const updatedUser = {
        ...user,
        username: document.getElementById("admin-username").value,
        email: document.getElementById("admin-email").value,
        dob: document.getElementById("admin-dob").value,
        avatar: avatarBase64,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      let message = "✅ Đã lưu thông tin!";
      if (avatarChanged) message += "\n✅ Avatar đã được cập nhật!";
      alert(message);
      location.reload();
    });
  }
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`section-${id}`).classList.remove('hidden');
}
