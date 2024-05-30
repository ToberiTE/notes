document.addEventListener("DOMContentLoaded", function () {
  getNotes();

  new Sortable(notesList, {
    animation: 150,
    ghostClass: "sortable-ghost",
    delay: 200,
    delayOnTouchOnly: true,
    onEnd: function () {
      saveNotes();
    },
  });

  const darkMode = localStorage.getItem("isDarkMode");
  let isDarkMode = false;
  if (darkMode !== null) {
    isDarkMode = darkMode === "true";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  if (isDarkMode) {
    darkModeToggle.innerHTML = "<img src='moon.svg' alt=''>";
  } else {
    darkModeToggle.innerHTML = "<img src='sun.svg' alt=''>";
  }
});
const darkModeToggle = document.getElementById("dark-mode-toggle");
const noteInput = document.getElementById("note-input");
const clearListBtn = document.getElementById("clear-list");
const notesList = document.getElementById("notes-list");
const dialog = document.querySelector("dialog");
const confirmClearBtn = document.getElementById("confirm-clear-list");
const cancelClearBtn = document.getElementById("cancel-clear-list");
const htmlColor = document.querySelector("meta[name=theme-color]");

noteInput.addEventListener("keydown", handleNoteInput);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("isDarkMode", true);
    darkModeToggle.innerHTML = "<img src='moon.svg' alt=''>";
    htmlColor.setAttribute("content", "#020202");
  } else {
    localStorage.setItem("isDarkMode", false);
    darkModeToggle.innerHTML = "<img src='sun.svg' alt=''>";
    htmlColor.setAttribute("content", "#fffaf0");
  }
});

clearListBtn.addEventListener("click", () => {
  dialog.showModal();
});

cancelClearBtn.addEventListener("click", () => {
  dialog.close();
});

confirmClearBtn.addEventListener("click", () => {
  clearNotesList();
  saveNotes();
  dialog.close();
});

function handleNoteInput(e) {
  if (e.key === "Enter") {
    const inputValue = noteInput.value.trim();
    if (inputValue) {
      addNote(inputValue);
      saveNotes();
      noteInput.value = "";
    }
  }
}

function addNote(text, isCompleted = false) {
  const li = document.createElement("li");
  const textSpan = document.createElement("p");
  textSpan.textContent = text;
  li.appendChild(textSpan);
  notesList.appendChild(li);

  if (isCompleted) {
    li.classList.toggle("li-completed");
    textSpan.classList.toggle("p-completed");
  }

  li.addEventListener("click", () => markAsCompleted(li, textSpan));
  appendDeleteButton(li);
  updateClearButtonVisibility();
}

function appendDeleteButton(li) {
  const deleteNoteBtn = document.createElement("button");
  deleteNoteBtn.innerHTML = `<span>&times;</span>`;
  deleteNoteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notesList.removeChild(li);
    saveNotes();
  });
  li.appendChild(deleteNoteBtn);
}

function markAsCompleted(li, textSpan) {
  li.classList.toggle("li-completed");
  textSpan.classList.toggle("p-completed");
  saveNotes();
  refreshNotes();
}

function saveNotes() {
  const notes = Array.from(notesList.querySelectorAll("li")).map((note) => {
    const text = note.querySelector("p").textContent;
    const isCompleted = note.classList.contains("li-completed");
    return { text, isCompleted };
  });
  notes.sort((a, b) => {
    return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  updateClearButtonVisibility();
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) ?? [];
  notes.forEach((note) => addNote(note.text, note.isCompleted));
  updateClearButtonVisibility();
}

function clearNotesList() {
  notesList.innerHTML = "";
}

function refreshNotes() {
  clearNotesList();
  getNotes();
}

function updateClearButtonVisibility() {
  if (!notesList.children.length) {
    clearListBtn.style.display = "none";
  } else {
    clearListBtn.style.display = "initial";
  }
}
