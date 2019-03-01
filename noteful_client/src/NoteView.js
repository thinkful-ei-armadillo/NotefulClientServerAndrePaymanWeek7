import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Note from './Note';
import NotefulContext from './NotefulContext';

export default class NoteView extends Component {
  static contextType = NotefulContext;

  render() {
    // note={this.state.notes.find(
    //   e => e.id === props.match.params.noteId
    // )}
    const { notes } = this.context;
    if (notes.length <= 0) {
      return <React.Fragment>loading...</React.Fragment>;
    }

    const note = notes.find(e => e.id === this.props.match.params.noteId);

    return (
      <React.Fragment>
        <div className="note-item">
          <Note
            date={note.modified}
            key={note.id}
            name={note.name}
            id={note.id}
          />
        </div>
        <p>{note.content}</p>
      </React.Fragment>
    );
  }
}
