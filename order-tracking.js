const order = JSON.parse(localStorage.getItem("currentOrder") || "null");

const statusList = ["Đang xử lý", "Đang giao", "Đã giao"];
let statusIndex = order ? statusList.indexOf(order.status || "Đang xử lý") : 0;

const audio = new Audio("c.mp3");

if (!order) {
  document.getElementById("order-info").innerHTML = `<p class="text-red-500">Không tìm thấy đơn hàng.</p>`;
} else {
  const container = document.getElementById("order-info");
  const items = order.items.map(item => {
    const qty = item.qty || 1;
    return `<li>${item.title} × ${qty}</li>`;
  }).join("");

  container.innerHTML = `
    <p><strong>👤 Khách hàng:</strong> ${order.customer.name}</p>
    <p><strong>📞 SĐT:</strong> ${order.customer.phone}</p>
    <p><strong>🏠 Địa chỉ:</strong> ${order.customer.address}</p>
    <p><strong>💳 Thanh toán:</strong> ${order.payment.toUpperCase()}</p>
    <p><strong>💰 Tổng tiền:</strong> ${order.total}</p>
    <p><strong>📚 Sách:</strong></p>
    <ul class="list-disc list-inside text-gray-700">${items}</ul>
  `;
}

function updateProgress() {
  const bar = document.getElementById("progress-bar");
  const statusText = document.getElementById("current-status-text");
  const updateBtn = document.getElementById("update-btn");
  const percent = ["w-1/3", "w-2/3", "w-full"];
  const progressClasses = ["w-1/3", "w-2/3", "w-full"];

  // Xoá class cũ
  progressClasses.forEach(cls => bar.classList.remove(cls));
  bar.classList.add(percent[statusIndex]);

  statusText.textContent = `📦 Trạng thái: ${statusList[statusIndex]}`;

  if (statusIndex === 2) {
    updateBtn.disabled = true;
    updateBtn.classList.add("opacity-50", "cursor-not-allowed");
    updateBtn.textContent = "Đã giao xong";
    document.getElementById("thankyou-message").classList.remove("hidden");
    document.getElementById("action-buttons").classList.remove("hidden");
    audio.play();
  }
}

function nextStatus() {
  if (statusIndex < 2) {
    statusIndex++;
    order.status = statusList[statusIndex];
    localStorage.setItem("currentOrder", JSON.stringify(order));
    updateProgress();
  }
}

updateProgress();
