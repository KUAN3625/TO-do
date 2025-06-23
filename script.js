const addBtn = document.getElementById("addBtn");
const board = document.getElementById("board");

// 拖曳函式
function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", (e) => {
    // 如果正在編輯文字就不要拖曳
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
note.innerHTML = `
  <div class="note-sprite"></div>
  <div class="note-content" contenteditable="false">雙擊編輯內容</div>
`;

  note.style.position = "absolute";
  note.style.top = "100px";
  note.style.left = "100px";
  note.contentEditable = false;

  // ✨ 加入動畫
  note.addEventListener("dblclick", () => {
  note.contentEditable = true;
  note.focus();

  // ✨ 加入動畫
  note.classList.remove("animate"); // 重置動畫（才能重播）
  void note.offsetWidth; // 強制重繪
  note.classList.add("animate");
});


  board.appendChild(note);
  makeDraggable(note);

  // 雙擊進入編輯模式
  note.addEventListener("dblclick", () => {
    note.contentEditable = true;
    note.focus();
  });

  // 離開時結束編輯
  note.addEventListener("blur", () => {
    note.contentEditable = false;
  });

  // 按 Enter 結束編輯（可選）
  note.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 不換行
      note.blur();        // 結束編輯
    }
  });
});



// 點便條觸發刪除
const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.addEventListener("click", () => {
  document.querySelectorAll(".note").forEach(note => {
    note.classList.add("fade-out"); // 套用動畫類別
    setTimeout(() => {
      note.remove(); // 等動畫結束再刪除元素
    }, 200); // 這個時間必須與動畫長度一致
  });
});


