import React, {Component} from 'react';
import {Link} from 'react-router-dom'

export default class Header extends Component {

  render() {
    return(
      <header>
        <h1>
          <Link to= '/'>Noteful</Link>
        </h1>
      </header>
    )
  }
}