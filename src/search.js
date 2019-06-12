"use strict";

import React from "react";
import ReactDOM from "react-dom";
import logo from "./images/logo.jpg";
import "./search.less";

class Search extends React.Component {
  render() {
    return (
      <div className="search-text">
        <img src={logo} />
        Search Text for watching
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById("root"));
