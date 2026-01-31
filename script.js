function goToProducts() {
  window.location.href = "products.html";
}

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Form submitted successfully (backend coming soon)");
    form.reset();
  });
});
