const express = require('express');
const noteRouter = express.Router();
const bodyParser = express.json();
const NotesService = require('./notes-service');
const xss = require('xss');
const path = require('path');

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  content: xss(note.content),
  modified: note.modified,
  folderId: note.folderId
});

noteRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name, content, folderId } = req.body;
    const newNote = { name, content, folderId };

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });
noteRouter
  .route('/:id')
  .all((req, res, next) => {
    NotesService.getById(req.app.get('db'), req.params.id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: 'note doesn\'t exist' }
          });
        }
        res.note = note; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { name, content, folderId } = req.body;
    const noteToUpdate = { name, content, folderId, modified: 'now()' };
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must content either 'name', 'content' or 'folderId'`
        }
      });
    }

    NotesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;