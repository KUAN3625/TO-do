const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const templateBtn = document.getElementById("templateBtn");
const styleMenu = document.getElementById("styleMenu");

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
  });
}

// 建立便條
addBtn.addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note";
  note.textContent = "雙擊編輯內容";
  note.style.position = "absolute";
  note.contentEditable = false;

  const maxLeft = window.innerWidth - 180;
  const maxTop = window.innerHeight - 250;
  note.style.top = `${Math.floor(Math.random() * maxTop)}px`;
  note.style.left = `${Math.floor(Math.random() * maxLeft)}px`;

  note.classList.add(styles[currentStyleIndex]);
  note.dataset.styleIndex = currentStyleIndex;

  board.appendChild(note);
  makeDraggable(note);

  note.addEventListener("dblclick", () => {
    note.contentEditable = true;
    note.focus();
  });

  note.addEventListener("blur", () => {
    note.contentEditable = false;
  });

  note.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      note.blur();
    }
  });
});

// 刪除全部便條
deleteBtn.addEventListener("click", () => {
  document.querySelectorAll(".note").forEach(note => {
    note.classList.add("fade-out");
    setTimeout(() => note.remove(), 300);
  });
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
