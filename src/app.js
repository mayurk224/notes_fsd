const express = require('express');
const noteModel = require('../models/notes.model');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("./public"));

app.use(cors())

// Routes

app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;
    const note = await noteModel.create({ title, content })
        .then(note => res.status(201).json({ message: 'Note created successfully', note }))
        .catch(err => res.status(500).json({ error: 'Failed to create note' }));
});

app.get('/api/notes', async (req, res) => {
    const notes = await noteModel.find()
        .then(notes => res.status(200).json(notes))
        .catch(err => res.status(500).json({ error: 'Failed to fetch notes' }));
});

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        await noteModel.findByIdAndDelete(id);
        res.status(200).json({ message: "delete sucessfully", id: id })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
})

app.patch("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        const updatedNote = await noteModel.findByIdAndUpdate(
            id,
            { content },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.status(200).json({ message: "Updated successfully", note: updatedNote });
    } catch (err) {
        res.status(500).json({ error: "Failed to update note" });
    }
});

app.get('/api/notes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const note = await noteModel
            .findById(id)
            .then(note => {
                if (!note) {
                    return res.status(404).json({ error: 'Note not found' });
                }
                res.status(200).json(note);
            }
            )
            .catch(err => res.status(500).json({ error: 'Failed to fetch note' }));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Serve the React app for any other routes
app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;