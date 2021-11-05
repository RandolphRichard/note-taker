const $noteList = $(".list-container .list-group");
const $newNoteBtn = $(".new-note");
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");

// textarea notes memory
let virtualNotes = {};

// function to generate notes via get
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// function to save notes via post
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// function to delete notes
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// function when the notes section is empty, save button won't appear, once notes added, save button will show
const generateVirtualNote = () => {
    $saveNoteBtn.hide();
  
    if (virtualNotes.id) {
      $noteTitle.attr("toread", true);
      $noteText.attr("toread", true);
      $noteTitle.val(virtualNotes.title);
      $noteText.val(virtualNotes.text);
    } else {
      $noteTitle.attr("toread", false);
      $noteText.attr("toread", false);
      $noteTitle.val("");
      $noteText.val("");
    }
  };

  // Save note
const manageSaveNote = function () {
    const newNote = {
      title: $noteTitle.val(),
      text: $noteText.val(),
    };
  
    saveNote(newNote).then(() => {
    generateNotes();
    generateVirtualNote();
    });
  };

  const manageDeleteNote = function (event) {
    // stop the list from being called when clicked on the button
    event.stopPropagation();
  
    const note = $(this).parent(".list-group-item").data();
  
    if (virtualNotes.id === note.id) {
      virtualNotes = {};
    }
  
    deleteNote(note.id).then(() => {
    generateNotes(); 
    generateVirtualNote();
    });
  };

  //  display the virtual note
const manageSetNote = function () {
    virtualNotes = $(this).data();
    generateVirtualNote();
  };
  
  // empty the virtual when needed
  const manageNewSetNote = function () {
    virtualNotes = {};
    generateVirtualNote();
  };

// emptied Notes, hide the button saved
// Or show it
const generateSaveBtn = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
      $saveNoteBtn.hide();
    } else {
      $saveNoteBtn.show();
    }
  };
  
  // generate the list of note titles
  const generateNoteList = (notes) => {
    $noteList.empty();
  
    const notelistI = [];
  
  
    const create$li = (text, withDeleteButton = true) => {
      const $li = $("<li class='list-group-item'>");
      const $span = $("<span>").text(text);
      $li.append($span);
  
      if (withDeleteButton) {
        const $delBtn = $(
          "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );
        $li.append($delBtn);
      }
      return $li;
    };
  
    if (notes.length === 0) {
      notelistI.push(create$li("Empty Note File", false));
    }
  
    notes.forEach((note) => {
      const $li = create$li(note.title).data(note);
      notelistI.push($li);
    });
  
    $noteList.append(notelistI);
  };

  const generateNotes = () => {
    return getNotes().then(generateNoteList);
  };
 
  
  $saveNoteBtn.on("click", manageSaveNote);
  $noteList.on("click", ".list-group-item", manageSetNote);
  $newNoteBtn.on("click", manageNewSetNote);
  $noteList.on("click", ".delete-note", manageDeleteNote);
  $noteTitle.on("keyup", generateSaveBtn);
  $noteText.on("keyup", generateSaveBtn);
  
// Gets and renders the initial list of notes
generateNotes();