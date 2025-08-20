import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const Display = ({ text1, text2 }) => {
  return (
    <div>
      <h1>{text1}</h1>
      <p>{text2}</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));
  const [highestVoted, setHighestVoted] = useState(0);

  const randomQuote = () => {
    const arrayLength = anecdotes.length;
    const randomIndex = Math.floor(Math.random() * arrayLength);
    setSelected(randomIndex);
  };
  const voteForQuote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    
    const maxValue = Math.max(...copy);
    const indexOfMaxValue = copy.indexOf(maxValue);
    setVotes(copy);
    setHighestVoted(indexOfMaxValue);
  
  };

  return (
    <div>
      {/* <h1>Anecdote of the day</h1>
      {anecdotes[selected]} */}
      <Display text1="Anecdote of the day" text2={anecdotes[selected]} />
      <p>has {votes[selected]} votes</p>
      <Button onClick={voteForQuote} text="Vote" />
      <Button onClick={randomQuote} text="Next Quote" />
      <Display
        text1="Anecdotes with the Largest Vote"
        text2={anecdotes[highestVoted]}
      />

      {/* <h1>Anecdotes with the Largest Vote</h1>
      <DisplayHighest votes={votes} anecdotes={anecdotes} /> */}
    </div>
  );
};

export default App;
