import ReactPlayer from "react-player";
import "./App.css";
import Button from "@mui/material/Button";
import { useState } from "react";
function App() {
  const [link,setLink]=useState("");
  function handleClick() {
    
  }
  return (
    <div className="App">
      <div className="grid">
        <div>asd</div>
        <div>
          <div className="playback">
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url={link}
                width="100%"
                height="100%"
              />
            </div>
              <div>
                <Button onClick={handleClick} variant="contained">Contained</Button>
              </div>
          </div>
        </div>
        <div>gfdsg</div>
      </div>
    </div>
  );
}

export default App;
