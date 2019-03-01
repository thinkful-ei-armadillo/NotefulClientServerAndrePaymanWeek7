import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NotefulContext from './NotefulContext';

export default class FolderSidebar extends Component {
  static contextType = NotefulContext;

  componentDidMount() {}

  foldersHtml() {
    /*folder={this.state.folders.find(
      e =>
        e.id ===
        this.state.notes.find(
          e => e.id === props.match.params.noteId
        ).folderId
    )}*/

    const { notes } = this.context;
    const { folders } = this.context;

    let folder;
    if (notes.length <= 0) {
      return <div>Loading...</div>;
    }
    const folderId = notes.find(e => e.id === this.props.match.params.noteId)
      .folderId;
    folder = folders.find(e => e.id === folderId);

    return (
      <div className="folder-sidebar">
        <Link to={`/folders/${folder.id}`}>Go back</Link>
        <p>Current Folder: {folder.name}</p>
      </div>
    );
  }
  render() {
    return <ul>{this.foldersHtml()}</ul>;
  }
}
