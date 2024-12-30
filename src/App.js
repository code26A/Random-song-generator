import ReactPlayer from "react-player";
import "./App.css";
import Button from "@mui/material/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import axios from "axios";
function App() {
  const [songNames, setSongNames] = useState([]);
  const [newSong, setNewSong] = useState("");

  const [Video_id, setVideo_id] = useState("");
  async function youtube_res(song) {
    try {
      console.log("Fetching video for song:", song); // Log the current song
      const result = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${song}&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );
      const videoId = result?.data?.items?.[0]?.id?.videoId;
      if (videoId) {
        setVideo_id(videoId);
        console.log("Fetched Video ID:", videoId);
      } else {
        console.error("No video found for the query:", song);
        setVideo_id("");
      }
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      setVideo_id("");
    }
  }

  async function handleClick() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let newGeneratedSong = "";
    let isUnique = false;

    // Create the prompt with the song list
    let songListText =
      songNames.length > 0 ? songNames.join(", ") : "No previous songs";
    let prompt = `Generate a famous random music video name (just name) and artist name (just name) that is not in the following list: ${songListText}.`;
    if (songNames.length === 0)
      prompt =
        "Generate a famous random song name (just name) and its artist name (just name)";

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
    youtube_res(newGeneratedSong); // Pass the generated song directly
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
                url={`https://www.youtube.com/watch?v=${Video_id}`}
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
        <div>
          <h3>Generated Songs:</h3>
          <ul>
            {songNames.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
