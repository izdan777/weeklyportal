function goToProducts() {
  window.location.href = "products.html";
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Message received — we will contact you soon.");
    form.reset();
  });
});
