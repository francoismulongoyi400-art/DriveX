const $ = (id) => document.getElementById(id);

// Mobile navigation
const nav = $("nav");
$("menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Dates
const today = new Date();
const todayISO = today.toISOString().split("T")[0];
$("startDate").min = todayISO;
$("endDate").min = todayISO;
$("startDate").addEventListener("change", () => {
  $("endDate").min = $("startDate").value || todayISO;
});

// Vehicle filtering/search
$("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const location = $("pickup").value.trim();
  const start = $("startDate").value;
  const end = $("endDate").value;
  const filter = $("vehicleFilter").value;

  if (new Date(end) < new Date(start)) {
    $("searchResult").textContent = "Please choose a return date after the start date.";
    return;
  }

  let visible = 0;
  document.querySelectorAll(".vehicle-card").forEach(card => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.style.display = matches ? "" : "none";
    if (matches) visible++;
  });

  $("searchResult").textContent =
    `${visible} vehicle${visible === 1 ? "" : "s"} available for ${location} from ${formatDate(start)} to ${formatDate(end)}.`;
});

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric"
  });
}

// Main booking modal
const modal = $("modal");
let selectedCar = "";

function openBooking(car = "Vehicle", price = "") {
  selectedCar = car;
  $("modalEyebrow").textContent = "BOOKING REQUEST";
  $("modalTitle").textContent = `Book ${car}`;
  $("modalChoice").value = price ? `${car} — ${price}/day` : car;
  $("modalMessage").textContent = "";
  modal.classList.remove("hidden");
}

document.querySelectorAll(".book-btn").forEach(button => {
  button.addEventListener("click", () => openBooking(button.dataset.car, button.dataset.price));
});

$("openLogin").addEventListener("click", () => {
  selectedCar = "Account";
  $("modalEyebrow").textContent = "ACCOUNT";
  $("modalTitle").textContent = "Sign in / Register";
  $("modalChoice").value = "Customer account";
  $("modalMessage").textContent = "";
  modal.classList.remove("hidden");
});

$("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

$("modalForm").addEventListener("submit", event => {
  event.preventDefault();
  $("modalMessage").textContent =
    "Request submitted successfully. A DriveX team member can confirm the booking once a backend is connected.";
  event.target.reset();
  $("modalChoice").value = selectedCar;
});

// Vehicle owner registration
$("ownerForm").addEventListener("submit", event => {
  event.preventDefault();

  const make = $("carMake").value.trim();
  const model = $("carModel").value.trim();

  $("ownerMessage").textContent =
    `${make} ${model} has been submitted for review. This demo is ready to connect to a database.`;

  event.target.reset();
});

// File upload label
$("carPhotos").addEventListener("change", function () {
  const label = this.nextElementSibling;
  const count = this.files.length;
  label.querySelector("span").textContent =
    count ? `${count} photo${count === 1 ? "" : "s"} selected` : "Add vehicle photos";
});

// Reviews
const reviewModal = $("reviewModal");
const ratingButtons = document.querySelectorAll("#ratingInput button");
let selectedRating = 0;

ratingButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    ratingButtons.forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.rating) <= selectedRating);
    });
  });
});

$("openReview").addEventListener("click", () => {
  $("reviewMessage").textContent = "";
  reviewModal.classList.remove("hidden");
});

$("closeReview").addEventListener("click", () => reviewModal.classList.add("hidden"));
reviewModal.addEventListener("click", e => {
  if (e.target === reviewModal) reviewModal.classList.add("hidden");
});

$("reviewForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!selectedRating) {
    $("reviewMessage").textContent = "Please select a rating first.";
    return;
  }

  const name = $("reviewName").value.trim();
  const text = $("reviewText").value.trim();

  const card = document.createElement("article"); // Create a new review card
  card.className = "review-card glass";
  card.innerHTML = `
    <div class="stars">${"★".repeat(selectedRating)}${"☆".repeat(5 - selectedRating)}</div>
    <p>“${escapeHTML(text)}”</p>
    <strong>${escapeHTML(name)}</strong>
    <span>New review</span>
  `;

  $("reviewGrid").prepend(card); // Add new review to the top of the grid
  $("reviewMessage").textContent = "Thank you. Your review has been added to this demo."; 
  event.target.reset();
  selectedRating = 0;
  ratingButtons.forEach(btn => btn.classList.remove("active"));

  setTimeout(() => reviewModal.classList.add("hidden"), 900);
});

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
