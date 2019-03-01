const express = require('express');
const folderRouter = express.Router();
const bodyParser = express.json();
const FoldersService = require('./folders-service');
const xss = require('xss');
const path = require('path');

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.name)
});

folderRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    FoldersService.insertFolder(req.app.get('db'), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${folder.id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });
folderRouter
  .route('/:id')
  .all((req, res, next) => {
    FoldersService.getById(req.app.get('db'), req.params.id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: 'folder doesn\'t exist' }
          });
        }
        res.folder = folder; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { name } = req.body;
    const folderToUpdate = { name };
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must content 'name'`
        }
      });
    }

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;