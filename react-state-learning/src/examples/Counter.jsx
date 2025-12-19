// src/examples/Counter.jsx
import {useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  const incrementThree = () => {
    // Functional updates avoid stale values
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  };

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={incrementThree}>+3</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}