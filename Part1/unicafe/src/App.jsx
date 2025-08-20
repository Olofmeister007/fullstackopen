import { useState } from "react";

const Button = (props) => {
  // console.log(props.onClick);
  // console.log(props.text)
  return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  // console.log(props)
  return <>
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
    </>
  
};
const Statistics = ({ good, bad, neutral }) => {
  const total = good + bad + neutral;

  const average = (1 * good + 0 * neutral + -1 * bad) / total;
  const positive = good / total;
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive * 100 + " %"} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodInc = () => {
    setGood(good + 1);
  };
  const neutralInc = () => {
    setNeutral(neutral + 1);
  };
  const badInc = () => {
    setBad((prev) => prev + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={goodInc} text="good" />
      <Button onClick={neutralInc} text="neutral" />
      <Button onClick={badInc} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
