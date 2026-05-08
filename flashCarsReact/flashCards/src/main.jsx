import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Study from "./StudyMode.jsx";
import "./App.css";

class ModeManager extends React.Component {
  state = { studyMode: false };

  render() {
    return (
      <div className="wrapper">
        <div className="centered-nav">
          <button className="mode-toggle" onClick={() => this.setState({ studyMode: !this.state.studyMode })}>
            {this.state.studyMode ? "GO TO CREATE MODE" : "GO TO STUDY MODE"}
          </button>
        </div>
        <hr />
        {this.state.studyMode ? <Study /> : <App />}
      </div>
    );
  }
}

const rootElement = document.querySelector("#root");
createRoot(rootElement).render(
  <StrictMode>
    <ModeManager />
  </StrictMode>
);