document.addEventListener("DOMContentLoaded", getNotes);

const addNoteBtn = document.getElementById("add-note");
const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");

addNoteBtn.onclick = function () {
  const inputValue = noteInput.value.trim();
  if (inputValue !== "") {
    addNote(inputValue);
    saveNotes();
  }
};

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

function completeNote(e) {
  if (e.target.tagName !== "BUTTON" && e.target.tagName !== "SPAN") {
    const li = e.target.closest("li");
    const textSpan = this.querySelector("p");
    li.classList.toggle("li-completed");
    textSpan.classList.toggle("p-completed");
    saveNotes();
  }
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
    const isCompleted = note.querySelector("p").classList.contains("completed");
    notes.push({ text, isCompleted });
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes"));
  if (notes) {
    notes.forEach((note) => {
      addNote(note.text, note.isCompleted);
    });
  }
}
