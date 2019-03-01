import React, { Component } from 'react';
import NotefulContext from './NotefulContext';
import { withRouter } from 'react-router-dom';


class AddFolder extends Component {
  static contextType = NotefulContext;

  state = {
    folderName: '',
    valid: false,
    validationMessage: 'Folder Name cannot be empty'
  };
  setFolderName = folderName => {
    this.setState({ folderName }, () => this.validateFolderName(folderName));
  };
  validateFolderName = folderName => {
    if (folderName.length !== 0) {
      this.setState({ valid: true });
    } else {
      this.setState({ valid: false });
    }
  };

  addFolderRequest = (folderName, callback) => {
    let self = this;
    fetch('http://localhost:9090/folders/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: folderName })
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
        self.props.history.push('/');
        callback(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const { valid, validationMessage } = this.state;
    return (
      <React.Fragment>
        <h2>Create a Folder</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.addFolderRequest(
              this.state.folderName,
              this.context.addFolder
            );
          }}
          action="submit"
        >
          <label htmlFor="folder-name">
            Name {!valid && <p className="error">{validationMessage}</p>}
          </label>
          <input
            onChange={e => this.setFolderName(e.target.value)}
            name="folder-name"
            value={this.state.folderName}
            type="text"
          />
          <button disabled={!this.state.valid} type="submit">
            Add Folder
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(AddFolder);
