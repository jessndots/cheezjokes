import React from "react";
import JokeList from "./JokeList-class";

function App() {
  return (
    <div className="App">
      <JokeList numJokesToGet={10}/>
    </div>
  );
}

export default App;
