import React from "react";
import axios from "axios";
import Joke from "./Joke-class";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {jokes: []};
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  /* get jokes if there are no jokes */
  async componentDidMount() {
    const j = [...this.state.jokes];
    const seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: {Accept: "application/json"}
        })
        const {status, ...jokeObj} = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({...jokeObj, votes: 0})
        } else {
          console.error("Duplicate found!");
        }
        this.setState({jokes: j});
      }
    } catch (e) {
      console.log(e);
    }    
  }

  async componentDidUpdate(prevProps) {
    const j = [...this.state.jokes];
    const seenJokes = new Set();
    if (j.length === 0) {
      try {
        while (j.length < this.props.numJokesToGet) {
          const res = await axios.get("https://icanhazdadjoke.com", {
            headers: {Accept: "application/json"}
          })
          const {status, ...jokeObj} = res.data;
  
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({...jokeObj, votes: 0})
          } else {
            console.error("Duplicate found!");
          }
          this.setState({jokes: j});
        }
      } catch (e) {
        console.log(e);
      }    
    }
  }  

  /* empty joke list and then call getJokes */
  generateNewJokes() {
    this.setState({jokes: []});
  }

  /* change vote for this id by delta (+1 or -1) */
  vote(id, delta) {
    this.setState({jokes: this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))})
  }

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }
    return null;  
  }
}



export default JokeList;
