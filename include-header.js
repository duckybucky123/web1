document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
    <!-- HEADER -->
    <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div class="flex items-center gap-3">
        <a href="/">
          <img src="./images(1).jpg" alt="logo" width="40" class="h-10 w-10 rounded-full object-cover" />
        </a>
        <div class="relative w-80">
          <input
            type="text"
            id="search-input"
            placeholder="Search books, authors, ISBNs"
            class="border rounded-md px-4 py-2 w-full shadow-sm"
            autocomplete="off"
          />
          <ul id="search-suggestions" class="absolute left-0 right-0 bg-white border mt-1 rounded shadow z-50 text-sm max-h-64 overflow-y-auto hidden"></ul>
        </div>
      </div>
      <div class="flex items-center gap-3 auth-buttons">
        <!-- Auth buttons sẽ được render bằng JavaScript -->
      </div>
    </header>

    <!-- NAVBAR -->
    <nav class="flex gap-6 px-6 py-3 border-b bg-gray-100">
      <a href="index.html" class="hover:underline">Home</a>
      <a href="book.html" class="hover:underline">Books</a>
      <a href="book-management.html" class="hover:underline">Book Management</a>
    </nav>
  `;

  document.body.insertAdjacentHTML("afterbegin", headerHTML);

  renderAuthButtons();
  updateCartCount();

  const path = window.location.pathname;
  const isSearchAllowed = !path.includes("checkout.html") && !path.includes("order-tracking.html");
  if (isSearchAllowed) setupSearchAutocomplete();
});

function renderAuthButtons() {
  const authDiv = document.querySelector(".auth-buttons");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!authDiv) return;

  if (isLoggedIn) {
    authDiv.innerHTML = `
      <a href="admin.html" title="${user.username || 'Quản trị viên'}">
        <img id="header-avatar" src="${user.avatar || './images(1).jpg'}"
          alt="avatar"
          class="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer hover:ring-2 ring-black transition"
        />
      </a>
      <button onclick="logout()" class="text-red-600 underline text-sm">Đăng xuất</button>
      <div class="relative group cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" onclick="window.location.href='cart.html'">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke-width="2" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
        </svg>
        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">0</span>
        <div id="cart-preview" class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3 hidden group-hover:block z-50 text-sm">
          <div id="cart-items-preview">Đang tải...</div>
        </div>
      </div>
    `;
  } else {
    authDiv.innerHTML = `
      <button onclick="openModal()" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Register</button>
      <a href="login.html">
        <button class="bg-black text-white px-4 py-2 rounded">Login</button>
      </a>
      <div class="relative group cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke-width="2" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
        </svg>
        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">0</span>
        <div id="cart-preview" class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3 hidden group-hover:block z-50 text-sm">
          <div id="cart-items-preview">Đang tải...</div>
        </div>
      </div>
    `;
  }

  updateCartCount();
  setupCartPreview();
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  location.reload();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cart.length;
}

function setupCartPreview() {
  const previewContainer = document.getElementById("cart-items-preview");
  if (!previewContainer) return;

  const render = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    previewContainer.innerHTML = cart.length
      ? cart.map(item => `<div class="mb-1">📘 ${item.title}</div>`).join("")
      : `<p class="text-gray-500 text-sm">Giỏ hàng trống.</p>`;
  };

  document.querySelector(".group")?.addEventListener("mouseenter", render);
}

// 🔍 Autocomplete Search
function setupSearchAutocomplete() {
  const input = document.getElementById("search-input");
  const suggestBox = document.getElementById("search-suggestions");

  if (!input || !suggestBox) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const books = JSON.parse(localStorage.getItem("books") || "[]");

    if (!query) {
      suggestBox.innerHTML = "";
      suggestBox.classList.add("hidden");
      return;
    }

    const matched = books.filter(book =>
      book.id?.toString().includes(query) ||
      book.title?.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      suggestBox.innerHTML = `<li class="px-4 py-2 text-gray-500">Không tìm thấy kết quả</li>`;
      suggestBox.classList.remove("hidden");
      return;
    }

    suggestBox.innerHTML = matched
      .slice(0, 10)
      .map(book => `
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" data-id="${book.id}">
          📘 ${book.title} - ${book.author || "Không rõ"}
        </li>
      `).join("");
    suggestBox.classList.remove("hidden");

    document.querySelectorAll("#search-suggestions li").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        const selectedBook = books.find(b => b.id?.toString() === id);
        if (selectedBook) {
          localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
          window.location.href = "book-detail.html";
        }
      });
    });
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = input.value.trim().toLowerCase();
      const books = JSON.parse(localStorage.getItem("books") || "[]");
      const result = books.find(book =>
        book.id?.toString() === query ||
        book.title?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)
      );
      if (result) {
        localStorage.setItem("selectedBook", JSON.stringify(result));
        window.location.href = "book-detail.html";
      } else {
        alert("Không tìm thấy sách phù hợp.");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.classList.add("hidden");
    }
  });
}
