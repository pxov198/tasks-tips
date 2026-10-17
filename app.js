const STORAGE_KEY = "tasks-tips.tasks.v1";
const tips = [
  { title: "Make the next step smaller.", copy: "If a task feels heavy, write down the first five-minute action. Starting is its own kind of progress." },
  { title: "Give one thing your full attention.", copy: "A short stretch of focused work often beats an afternoon of half-starts. Close one loop before opening another." },
  { title: "Done is a useful kind of beautiful.", copy: "Let the first version be simple. You can make it better once there is something real to improve." },
  { title: "Leave a little room in the day.", copy: "A list is a guide, not a contract. Keep enough space for the unexpected and the genuinely important." },
  { title: "Notice what is already working.", copy: "Before you plan the next move, take a moment to count the progress you have made." }
];
const starterTasks = [
  { id: "starter-1", title: "Choose the one thing that matters most", done: false },
  { id: "starter-2", title: "Clear a little space to think", done: false },
  { id: "starter-3", title: "Take a proper lunch break", done: true }
];

const taskList = document.querySelector("#task-list");
const addForm = document.querySelector("#add-form");
const taskInput = document.querySelector("#task-input");
const emptyState = document.querySelector("#empty-state");
const clearDoneButton = document.querySelector("#clear-done");
const viewTabs = [...document.querySelectorAll(".view-tab")];
let currentFilter = "all";
let tipIndex = 0;
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.every((task) => task && typeof task.id === "string" && typeof task.title === "string" && typeof task.done === "boolean")) {
      return saved;
    }
  } catch {
    // Use the starter list if storage is unavailable or malformed.
  }
  return starterTasks.map((task) => ({ ...task }));
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    document.querySelector(".rail-footer span:last-child").textContent = "Storage unavailable in this browser";
  }
}

function createTaskRow(task) {
  const row = document.createElement("li");
  row.className = `task-row${task.done ? " is-done" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `${task.done ? "Mark unfinished" : "Mark complete"}: ${task.title}`);
  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked;
    saveTasks();
    render();
  });

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const removeButton = document.createElement("button");
  removeButton.className = "delete-button";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove task: ${task.title}`);
  removeButton.addEventListener("click", () => {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    render();
  });

  row.append(checkbox, title, removeButton);
  return row;
}

function render() {
  const doneCount = tasks.filter((task) => task.done).length;
  const openCount = tasks.length - doneCount;
  const visibleTasks = tasks.filter((task) => currentFilter === "all" || (currentFilter === "open" ? !task.done : task.done));

  taskList.replaceChildren(...visibleTasks.map(createTaskRow));
  document.querySelector("#all-count").textContent = tasks.length;
  document.querySelector("#open-count").textContent = openCount;
  document.querySelector("#done-count").textContent = doneCount;
  document.querySelector("#task-total").textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  document.querySelector("#list-label").textContent = currentFilter === "open" ? "IN PROGRESS" : currentFilter === "done" ? "FINISHED" : "YOUR TASKS";
  clearDoneButton.hidden = doneCount === 0;
  emptyState.hidden = visibleTasks.length > 0;
  emptyState.textContent = currentFilter === "done" ? "Nothing finished just yet. Your next small win is waiting." : currentFilter === "open" ? "All caught up. Take a breath." : "A clear page. Add a task to begin.";

  const completion = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  document.querySelector("#progress-number").textContent = `${completion}%`;
  document.querySelector("#progress-fill").style.width = `${completion}%`;
  const progressTrack = document.querySelector("#progress-track");
  progressTrack.setAttribute("aria-valuenow", completion);
  document.querySelector("#progress-caption").textContent = tasks.length ? `${doneCount} of ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} finished` : "Pick one thing and begin.";

  viewTabs.forEach((tab) => {
    const active = tab.dataset.filter === currentFilter;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
}

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title, done: false });
  currentFilter = "all";
  saveTasks();
  render();
  taskInput.value = "";
  taskInput.focus();
});

viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentFilter = tab.dataset.filter;
    render();
  });
});

clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
});

document.querySelector("#next-tip").addEventListener("click", () => {
  tipIndex = (tipIndex + 1) % tips.length;
  document.querySelector("#tip-heading").textContent = tips[tipIndex].title;
  document.querySelector("#tip-copy").textContent = tips[tipIndex].copy;
  document.querySelector("#tip-index").textContent = `${String(tipIndex + 1).padStart(2, "0")} / ${String(tips.length).padStart(2, "0")}`;
});

document.querySelector("#today-date").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
render();