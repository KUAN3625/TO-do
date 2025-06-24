
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const templateBtn = document.getElementById("templateBtn");
const styleMenu = document.getElementById("styleMenu");
const board = document.getElementById("board");

const styles = ["note-yellow", "note-pink", "note-green"];
let currentStyleIndex = 0;

updateTemplateButtonColor();

// 拖曳函式
function makeDraggable(element) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  element.addEventListener("mousedown", (e) => {
    if (element.contentEditable === "true") return;
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = "1000";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    saveNotesToLocalStorage();
  });
}

// 儲存便條到 localStorage
function saveNotesToLocalStorage() {
  const notes = Array.from(document.querySelectorAll(".note")).map(note => ({
    content: note.innerText,
    x: parseInt(note.style.left),
    y: parseInt(note.style.top),
    style: [...note.classList].find(cls => cls.startsWith("note-")) || "note-yellow"
  }));
  localStorage.setItem("notes", JSON.stringify(notes));
}

// 載入便條
function loadNotesFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("notes") || "[]");
  data.forEach(note => {
    createNote(note);
  });
}

// 建立便條
function createNote(data = {}) {
  const note = document.createElement("div");
  note.className = "note " + (data.style || styles[currentStyleIndex]);
  note.textContent = data.content || "雙擊編輯內容";
  note.style.position = "absolute";
note.style.top = (data.y || Math.floor(Math.random() * 200 + 80)) + "px";
note.style.left = (data.x || Math.floor(Math.random() * 300 + 50)) + "px";

  note.contentEditable = false;

  board.appendChild(note);
  makeDraggable(note);

  note.addEventListener("dblclick", () => {
    note.contentEditable = true;
    note.focus();
  });

  note.addEventListener("blur", () => {
    note.contentEditable = false;
    saveNotesToLocalStorage();
  });

  note.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      note.blur();
    }
  });

  return note;
}

// 建立按鈕事件
addBtn.addEventListener("click", () => {
  const note = createNote();
  saveNotesToLocalStorage();
});

// 刪除全部便條
deleteBtn.addEventListener("click", () => {
  document.querySelectorAll(".note").forEach(note => {
    note.classList.add("fade-out");
    setTimeout(() => note.remove(), 300);
  });
  localStorage.removeItem("notes");
});

// 點選樣式選項 → 改變預設樣式
document.querySelectorAll(".style-option").forEach(button => {
  button.addEventListener("click", () => {
    const selectedStyle = button.dataset.style;
    currentStyleIndex = styles.indexOf(selectedStyle);
    updateTemplateButtonColor();
    styleMenu.classList.add("hidden");
  });
});

// 懸停顯示選單
templateBtn.addEventListener("mouseenter", () => {
  styleMenu.classList.remove("hidden");
});
styleMenu.addEventListener("mouseleave", () => {
  styleMenu.classList.add("hidden");
});

// 更新樣式按鈕背景顏色
function updateTemplateButtonColor() {
  const btn = document.getElementById("templateBtn");
  const currentClass = styles[currentStyleIndex];
  const styleColors = {
    "note-yellow": "#fff8a6",
    "note-pink": "#ffe6f0",
    "note-green": "#e0ffcc"
  };
  btn.style.backgroundColor = styleColors[currentClass] || "#333";
  btn.style.color = "#000";
}

// 初次載入時恢復便條
loadNotesFromLocalStorage();
