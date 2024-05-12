document.addEventListener("DOMContentLoaded", getNotes);

const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");

noteInput.addEventListener("keydown", handleNoteInput);

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
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) ?? [];
  notes.forEach((note) => addNote(note.text, note.isCompleted));
}

function clearNotesList() {
  notesList.innerHTML = "";
}

function refreshNotes() {
  clearNotesList();
  getNotes();
}
