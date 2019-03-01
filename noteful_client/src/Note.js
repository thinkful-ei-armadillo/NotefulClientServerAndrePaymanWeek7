import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NotefulContext from './NotefulContext';
import { withRouter } from 'react-router-dom';

class Note extends Component {
  static contextType = NotefulContext;

  deleteNoteRequest = (noteId, callback) => {
    let self = this;
    fetch('http://localhost:9090/notes/' + noteId, {
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
        return res.json();
      })
      .then(data => {
        // call the callback when the reqyest is successful
        // this is where the App component can remove it from state
        self.props.history.push('/');
        callback(noteId);
      })
      .catch(error => {
        console.error(error);
      });
  };



  render() {
    let date = new Date(this.props.date);
    let dateString = date.toDateString();
    //date.getMonth() + 1 + ' ' + date.getDate() + ',' + date.getFullYear();

    return (
      <React.Fragment>
        <h2>
          <Link to={`/notes/${this.props.id}`}>{this.props.name}</Link>
        </h2>
        <div>Last Modified: {dateString}</div>
        <button
          onClick={() =>
            this.deleteNoteRequest(this.props.id, this.context.deleteNote)
          }
        >
          Delete Note
        </button>
      </React.Fragment>
    );
  }
}

export default withRouter(Note);
