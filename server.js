// used to import the necessary dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// set up PORT and activate the dependencies being used.
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/db.json');

// insert the middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// routes to HTML files
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

// routes to get API
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err,data) => {
    if (err) throw err
    let allNotes = JSON.parse(data);
    res.json(allNotes);
    });
});
// posting requests
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = notes.length + 1;

        notes.push(newNote);

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.json(newNote);  
        });
    });
});

// can be used to delete a note entry
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== noteId);
    
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.sendStatus(204);
        });
    });
});

// used to start the server
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});