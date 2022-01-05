import React, { Component } from "react";
import "./App.less";

import MainSider from "./components/Sider";

class App extends Component {
  render() {
    return (
      <div className="div-default">
        <MainSider></MainSider>
      </div>
    );
  }
}

export default App;
