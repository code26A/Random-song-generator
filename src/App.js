import ReactPlayer from "react-player";
import "./App.css";
import Button from "@mui/material/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

function App() {
  const [link, setLink] = useState("");
  const [songNames, setSongNames] = useState([]);
  const [newSong, setNewSong] = useState("");

  async function handleClick() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let newGeneratedSong = "";
    let isUnique = false;

    // Create the prompt with the song list
    let songListText = songNames.length > 0 ? songNames.join(", ") : "No previous songs";
    const prompt = `Generate a unique random music video name and that is not in the following list: ${songListText}.`;

    while (!isUnique) {
      const result = await model.generateContent(prompt);
      newGeneratedSong = result.response.text().trim();

      // Check if the new song name is unique
      if (!songNames.includes(newGeneratedSong)) {
        isUnique = true;
      } else {
        songListText = `${songListText}, ${newGeneratedSong}`; // Update the list with the new song
      }
    }

    setSongNames([...songNames, newGeneratedSong]);
    setNewSong(newGeneratedSong);
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
              <Button onClick={handleClick} variant="contained">
                Generate Song Name
              </Button>
            </div>
            {newSong && <p>New song name: {newSong}</p>}
            
          </div>
        </div>
        <div><h3>Generated Songs:</h3>
            <ul>
              {songNames.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul></div>
      </div>
    </div>
  );
}

export default App;
