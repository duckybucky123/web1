document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input[type='text']");
    if (!input) return;
  
    // Tạo khung hiển thị gợi ý
    const suggestBox = document.createElement("ul");
    suggestBox.id = "search-suggestions";
    suggestBox.className = "absolute left-0 right-0 bg-white border mt-1 rounded shadow z-50 text-sm max-h-64 overflow-y-auto hidden";
    input.parentNode.style.position = "relative";
    input.parentNode.appendChild(suggestBox);
  
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
  
    // Enter để chuyển đến kết quả đầu tiên
    input.addEventListener("keydown", e => {
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
  
    // Ẩn khi click ra ngoài
    document.addEventListener("click", e => {
      if (!input.contains(e.target) && !suggestBox.contains(e.target)) {
        suggestBox.classList.add("hidden");
      }
    });
  });
  