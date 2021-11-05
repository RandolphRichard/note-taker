// Creating the dependencies
const express = require("express");
const fs = require("fs");
const { request } = require("http");
const path = require("path");
const shortid = require("shortid");
const app = express();
const PORT = process.env.PORT || 3001;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// end Creating the dependencies

// Creating the get requests
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    return res.json(allNotes);
  });
});
// end Creating the get requests

//creating the post requests
app.post("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    let newNote = {
      title: req.body.title,
      text: req.body.text,
      id: shortid.generate(),
    };
    allNotes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(allNotes, null, 2), (err) => {
      if (err) throw err;
      res.send("This is great");
    });
  });
});
//end creating the post requests

// listen
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
// end listen