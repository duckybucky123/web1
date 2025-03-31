let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function renderCart() {
  const container = document.getElementById("cart-list");
  container.innerHTML = cart.length
    ? ""
    : `<p class="text-gray-600">Giỏ hàng của bạn trống.</p>`;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-4 bg-white shadow rounded";

    div.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" class="cart-checkbox" data-index="${index}" />
        <div>
          <p class="font-semibold">${item.title}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="changeQty(${index}, -1)" class="border rounded px-2">-</button>
            <span>${item.qty || 1}</span>
            <button onclick="changeQty(${index}, 1)" class="border rounded px-2">+</button>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span>${Number(item.price).toLocaleString("vi-VN")}đ</span>
        <button onclick="removeItem(${index})" class="text-red-500 hover:underline text-sm">Xóa</button>
      </div>
    `;

    container.appendChild(div);
  });

  document.getElementById("select-all").addEventListener("change", function () {
    document.querySelectorAll(".cart-checkbox").forEach(cb => cb.checked = this.checked);
  });
}

function changeQty(index, delta) {
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function goToCheckout() {
  const selected = [...document.querySelectorAll(".cart-checkbox")]
    .map((cb, i) => cb.checked ? cart[i] : null)
    .filter(Boolean);

  localStorage.setItem("checkout", JSON.stringify(selected));
  window.location.href = "checkout.html";
}

renderCart();
