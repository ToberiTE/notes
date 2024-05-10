document.addEventListener("DOMContentLoaded", getNotes);

const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");

noteInput.addEventListener("keydown", function (e) {
  const inputValue = noteInput.value.trim();
  if (e.key === "Enter") {
    if (inputValue !== "") {
      addNote(inputValue);
      saveNotes();
    }
  }
});

function addNote(text, isCompleted = false) {
  const li = document.createElement("li");
  const textSpan = document.createElement("p");
  textSpan.textContent = text;
  if (isCompleted) {
    li.classList.add("li-completed");
    textSpan.classList.add("p-completed");
  }
  li.appendChild(textSpan);
  notesList.appendChild(li);
  noteInput.value = "";
  li.addEventListener("click", completeNote);

  const deleteNoteBtn = document.createElement("button");
  deleteNoteBtn.innerHTML = "<span>&times;</span>";
  deleteNoteBtn.addEventListener("click", deleteNote);
  li.appendChild(deleteNoteBtn);
}

function completeNote() {
  const li = this.closest("li");
  const textSpan = this.querySelector("p");
  li.classList.toggle("li-completed");
  textSpan.classList.toggle("p-completed");
  saveNotes();
}

function deleteNote(e) {
  e.stopPropagation();
  const note = e.target.closest("li");
  notesList.removeChild(note);
  saveNotes();
}

function saveNotes() {
  const notes = [];
  document.querySelectorAll("#notes-list li").forEach((note) => {
    const text = note.querySelector("p").textContent;
    const isCompleted =
      note.querySelector("p").classList.contains("p-completed") &&
      note.closest("li").classList.contains("li-completed");
    notes.push({ text, isCompleted });
  });
  notes.sort((a, b) => {
    return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  refreshNotes();
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes"));
  if (notes) {
    notes.forEach((note) => {
      addNote(note.text, note.isCompleted);
    });
  }
}

function clearNotes() {
  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }
}

function refreshNotes() {
  clearNotes();
  getNotes();
}
