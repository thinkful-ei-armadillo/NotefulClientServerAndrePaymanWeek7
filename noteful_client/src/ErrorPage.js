import React, { Component } from 'react';

class ErrorPage extends Component {
  state = {
    error: false
  };
  static getDerivedStateFromError(error) {
    // Called when an error is thrown in a child component
    console.error(error);
    // Store the error in the state
    this.setState({ error });
  }
  render() {
    if (this.state.error) {
      return (
        <main className="errorPage">
          <h1>This is a display for error message : {this.state.error}</h1>
          <p>Refresh the page</p>
        </main>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorPage;
