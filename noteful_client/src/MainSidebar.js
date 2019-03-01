import React, { Component } from 'react';
import NotefulContext from './NotefulContext';
import { Link } from 'react-router-dom';

export default class MainSidebar extends Component {
  static contextType = NotefulContext;

  deleteFolder = (e, id) => {
    fetch('http://localhost:8000/api/folders/' + id, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error;
          });
        }
      })
      .then(data => {
        this.props.history.push('/');
        this.context.deleteFolder(id);
      })
      .catch(error => {
        console.error(error);
      });
  };

  foldersHtml() {
    let selectedFolder;
    const { folders } = this.context;
    if (this.props.match && this.props.match.params) {
      selectedFolder = this.props.match.params.folderId;
    }

    return folders.map(folder => {
      const className = `note-folder ${
        selectedFolder && selectedFolder === folder.id ? 'selected' : ''
      }`;

      return (
        <li className={className} key={folder.id} data-id={folder.id}>
          <button onClick={e => this.deleteFolder(e, folder.id)}>
            Delete Folder
          </button>
          <Link to={`/folders/${folder.id}`}>
            {folder.name ? folder.name : folder.id}
          </Link>
        </li>
      );
    });
  }
  render() {
    return (
      <React.Fragment>
        <ul>{this.foldersHtml()}</ul>
        <Link to={`/add-folder`}>Add Folder</Link>
      </React.Fragment>
    );
  }
}

MainSidebar.defaultProps = {
  folders: [],
  match: null
};
