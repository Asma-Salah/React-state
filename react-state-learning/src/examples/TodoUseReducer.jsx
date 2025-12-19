// src/examples/TodoUseReducer.jsx
import { useReducer, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, { id: Date.now(), text: action.payload }];
    case 'remove': return state.filter(t => t.id !== action.payload);
    default: return state;
  }
}

export function TodoUseReducer() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [text, setText] = useState('');

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { dispatch({ type: 'add', payload: text }); setText(''); }}>
        Add
      </button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.text} <button onClick={() => dispatch({ type: 'remove', payload: t.id })}>Del</button>
          </li>
        ))}
      </ul>
    </div>
  );
}