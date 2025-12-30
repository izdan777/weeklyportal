// ===== WEEK LOGIC (FRIDAY - THURSDAY) =====
function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)

  // Friday = 5
  const diffToFriday = (day >= 5)
    ? day - 5
    : day + 2;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - diffToFriday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { weekStart, weekEnd };
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  });
}

// ===== TASK DATA =====
const tasks = [
  { id: 1, title: "Clean room", points: 10, completed: false },
  { id: 2, title: "Read 10 pages", points: 5, completed: false }
];

// ===== ELEMENTS =====
const taskListEl = document.querySelector(".task-list");
const progressTextEl = document.querySelector(".progress-text");
const progressFillEl = document.querySelector(".progress-fill");
const statusEl = document.querySelector(".status");
const weekTextEl = document.querySelector(".week-text");

// ===== MODAL ELEMENTS =====
const addTaskBtn = document.querySelector(".add-task-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const taskTitleInput = document.querySelector(".task-title-input");
const taskPointsInput = document.querySelector(".task-points-input");
const addTaskConfirmBtn = document.querySelector(".add-task-confirm-btn");
const addTaskCancelBtn = document.querySelector(".add-task-cancel-btn");

// ===== UPDATE WEEK TEXT =====
function updateWeekText() {
  const { weekStart, weekEnd } = getCurrentWeek();
  weekTextEl.textContent = `Week: ${formatDate(weekStart)} – ${formatDate(weekEnd)}`;
}

// ===== RENDER TASKS =====
function renderTasks() {
  taskListEl.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} />
      <span>${task.title}</span>
      <span class="points">+${task.points} pts</span>
    `;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      updateProgress();
    });

    taskListEl.appendChild(li);
  });
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const completedPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  const percentage = totalPoints === 0 ? 0 : Math.round((completedPoints / totalPoints) * 100);
  progressTextEl.textContent = `${percentage}% Completed`;
  progressFillEl.style.width = `${percentage}%`;

  if (percentage >= 80) {
    statusEl.textContent = "🎉 Achieved! Great job!";
    statusEl.style.color = "#4caf50";
  } else {
    statusEl.textContent = "❌ Not Achieved (Need 80%)";
    statusEl.style.color = "#e53935";
  }
}

// ===== MODAL LOGIC =====
// Open modal
addTaskBtn.addEventListener("click", () => {
  taskTitleInput.value = "";
  taskPointsInput.value = 5;
  modalOverlay.classList.add("show");
  taskTitleInput.focus();
});

// Close modal
addTaskCancelBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("show");
  }
});

// Add task
addTaskConfirmBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const points = parseInt(taskPointsInput.value);

  if (!title || isNaN(points) || points <= 0) {
    alert("Please enter a valid task name and points!");
    return;
  }

  const newTask = { id: Date.now(), title, points, completed: false };
  tasks.push(newTask);
  renderTasks();
  updateProgress();
  modalOverlay.classList.remove("show");
});

// ===== INIT =====
updateWeekText();
renderTasks();
updateProgress();
