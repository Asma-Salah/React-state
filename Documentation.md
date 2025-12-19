# Toolkit: Learning React State Management (Hooks & Side Effects)

## 1. Title & Objective
**Title:** Getting Started with React State Management — Hooks & Side Effects  
**Objective:** Learn core React state concepts (useState, useEffect, useReducer, useContext), build minimal runnable examples, document AI prompts used and debugging notes so others can reproduce.

- Technology chosen: React (functional components + hooks)  
- Why: Hooks are the modern standard for component state & lifecycle; mastering them prevents common bugs and enables reusable logic.  
- End goal: Run small examples (Counter, API fetch), understand internals, fix common errors, and produce shareable documentation.

---

## 2. Quick Summary of the Technology

- What is it: React is a component library; Hooks let functional components hold state and run side effects.  
- Where used: Web UI, SPAs, dashboards, forms, client apps.  
- Real-world example: E‑commerce cart using useReducer (cart actions), useContext (user/theme), and useEffect (sync localStorage).

---

## 3. System Requirements

- OS: Windows / macOS / Linux  
- Tools: Node.js (16+), npm (7+), VS Code, Git  
- Optional: Chrome + React DevTools

Verify:
```bash
node --version
npm --version
```

---

## 4. Installation & Setup Instructions

1. Create project (Vite recommended):
```bash
npm create vite@latest react-state-learning -- --template react
cd react-state-learning
npm install
npm run dev
```
2. Project structure (recommended):
```
src/
  examples/
    Counter.jsx
    UserFetcher.jsx
    TodoUseReducer.jsx
  App.jsx
  main.jsx
```
3. VS Code extensions: ESLint, Prettier, React snippets, React DevTools (browser).

---

## 5. Minimal Working Example(s)

A. Counter (useState)
- Purpose: demonstrate state and functional updates.

```jsx
// src/examples/Counter.jsx
import { useState } from 'react';

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
```

B. UserFetcher (useEffect)
- Purpose: fetch data on mount / refetch on id change, handle loading/errors.

```jsx
// src/examples/UserFetcher.jsx
import { useState, useEffect } from 'react';

export function UserFetcher() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h4>{user.name}</h4>
      <button onClick={() => setUserId(id => Math.max(1, id - 1))}>Prev</button>
      <span> User {userId} </span>
      <button onClick={() => setUserId(id => id + 1)}>Next</button>
    </div>
  );
}
```

C. Small reducer example (useReducer)
```jsx
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
```

Expected: run `npm run dev`, import examples in App.jsx to try them.

---

## 6. AI Prompt Journal (documentation reference)
Record of key prompts used and reflections.

- Prompt A: "Explain React useState hook like I'm a beginner... include code example and common mistakes."
  - Useful: clear analogy, counter example, note on stale closures.
  - Helpfulness: high — provided immediate runnable code.

- Prompt B: "Explain useEffect dependency array cases, stale closures, and cleanup patterns with examples."
  - Useful: clarified when to add dependencies; showed AbortController, refs, functional updates.
  - Helpfulness: high — prevented missing-deps bugs.

- Prompt C: "How to fix 'Can't perform a React state update on an unmounted component' — show 3 solutions."
  - Useful: gave isMounted flag, AbortController, proper cleanup examples.
  - Helpfulness: critical for network error handling.

- Prompt D: "When to use useState vs object state vs useReducer. Provide decision matrix."
  - Useful: architectural guidance for forms and complex state.
  - Helpfulness: high — helped pick useReducer for cart/todo.

Keep these prompts and AI responses in a subfolder (ai-prompts.md) for reproducibility.

---

## 7. Common Issues & Fixes (concise)

1. Too many re-renders
   - Cause: setState in render or effect without proper deps.
   - Fix: move setState to handler or add proper dependency array / guard conditions.

2. Stale closure in useEffect
   - Cause: effect captured old values (empty deps).
   - Fix: include dependencies, use functional updates, or useRef to store latest value.

3. State update on unmounted component
   - Cause: async result setting state after unmount.
   - Fix: AbortController or isMounted flag; always cleanup.

4. Hooks called conditionally / changed order
   - Cause: calling hooks inside if/loops.
   - Fix: call hooks unconditionally; extract conditional logic to child components or custom hooks.

5. Missing dependencies (ESLint warning)
   - Fix: include used variables in deps or restructure effect to avoid referencing changing values.

---

## 8. References

- React docs (hooks): https://react.dev/reference/react  
- Dan Abramov: "A Complete Guide to useEffect" — overreacted.io  
- JSONPlaceholder (API used in examples): https://jsonplaceholder.typicode.com/  
- React DevTools extension

---

## 9. Deliverables & How to Submit

- Files to include in repo:
  - README.md (run instructions)
  - documentation.md (this file)
  - state.md (detailed guide; already present)
  - src/examples/* (Counter.jsx, UserFetcher.jsx, TodoUseReducer.jsx)
- Commit to GitHub or ZIP the project. Ensure README contains `npm install` and `npm run dev`.

---

## 10. Short Checklist (for validator)

- [ ] Repo builds and `npm run dev` starts site  
- [ ] Counter example works and demonstrates functional updates  
- [ ] UserFetcher fetches and handles loading/error/abort  
- [ ] TodoUseReducer shows add/remove via useReducer  
- [ ] documentation.md and state.md present with prompts and fixes recorded

---

## Notes & Best Practices (short)
- Always think: "Is this state local or shared?" Lift up or use Context accordingly.  
- Prefer functional updates when the new value depends on previous state.  
- Add cleanup to effects for timers, listeners, and network requests.  
- Use ESLint hooks plugin — it warns about missing dependencies and common mistakes.

---

End of documentation — paste this file as `documentation.md` in your project root and update README with run instructions.// filepath: c:\Users\HP\Desktop\React-states\documentation.md
# Toolkit: Learning React State Management (Hooks & Side Effects)

## 1. Title & Objective
**Title:** Getting Started with React State Management — Hooks & Side Effects  
**Objective:** Learn core React state concepts (useState, useEffect, useReducer, useContext), build minimal runnable examples, document AI prompts used and debugging notes so others can reproduce.

- Technology chosen: React (functional components + hooks)  
- Why: Hooks are the modern standard for component state & lifecycle; mastering them prevents common bugs and enables reusable logic.  
- End goal: Run small examples (Counter, API fetch), understand internals, fix common errors, and produce shareable documentation.

---

## 2. Quick Summary of the Technology

- What is it: React is a component library; Hooks let functional components hold state and run side effects.  
- Where used: Web UI, SPAs, dashboards, forms, client apps.  
- Real-world example: E‑commerce cart using useReducer (cart actions), useContext (user/theme), and useEffect (sync localStorage).

---

## 3. System Requirements

- OS: Windows / macOS / Linux  
- Tools: Node.js (16+), npm (7+), VS Code, Git  
- Optional: Chrome + React DevTools

Verify:
```bash
node --version
npm --version
```

---

## 4. Installation & Setup Instructions

1. Create project (Vite recommended):
```bash
npm create vite@latest react-state-learning -- --template react
cd react-state-learning
npm install
npm run dev
```
2. Project structure (recommended):
```
src/
  examples/
    Counter.jsx
    UserFetcher.jsx
    TodoUseReducer.jsx
  App.jsx
  main.jsx
```
3. VS Code extensions: ESLint, Prettier, React snippets, React DevTools (browser).

---

## 5. Minimal Working Example(s)

A. Counter (useState)
- Purpose: demonstrate state and functional updates.

```jsx
// src/examples/Counter.jsx
import { useState } from 'react';

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
```

B. UserFetcher (useEffect)
- Purpose: fetch data on mount / refetch on id change, handle loading/errors.

```jsx
// src/examples/UserFetcher.jsx
import { useState, useEffect } from 'react';

export function UserFetcher() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h4>{user.name}</h4>
      <button onClick={() => setUserId(id => Math.max(1, id - 1))}>Prev</button>
      <span> User {userId} </span>
      <button onClick={() => setUserId(id => id + 1)}>Next</button>
    </div>
  );
}
```

C. Small reducer example (useReducer)
```jsx
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
```

Expected: run `npm run dev`, import examples in App.jsx to try them.

---

## 6. AI Prompt Journal (documentation reference)
Record of key prompts used and reflections.

- Prompt A: "Explain React useState hook like I'm a beginner... include code example and common mistakes."
  - Useful: clear analogy, counter example, note on stale closures.
  - Helpfulness: high — provided immediate runnable code.

- Prompt B: "Explain useEffect dependency array cases, stale closures, and cleanup patterns with examples."
  - Useful: clarified when to add dependencies; showed AbortController, refs, functional updates.
  - Helpfulness: high — prevented missing-deps bugs.

- Prompt C: "How to fix 'Can't perform a React state update on an unmounted component' — show 3 solutions."
  - Useful: gave isMounted flag, AbortController, proper cleanup examples.
  - Helpfulness: critical for network error handling.

- Prompt D: "When to use useState vs object state vs useReducer. Provide decision matrix."
  - Useful: architectural guidance for forms and complex state.
  - Helpfulness: high — helped pick useReducer for cart/todo.

Keep these prompts and AI responses in a subfolder (ai-prompts.md) for reproducibility.

---

## 7. Common Issues & Fixes (concise)

1. Too many re-renders
   - Cause: setState in render or effect without proper deps.
   - Fix: move setState to handler or add proper dependency array / guard conditions.

2. Stale closure in useEffect
   - Cause: effect captured old values (empty deps).
   - Fix: include dependencies, use functional updates, or useRef to store latest value.

3. State update on unmounted component
   - Cause: async result setting state after unmount.
   - Fix: AbortController or isMounted flag; always cleanup.

4. Hooks called conditionally / changed order
   - Cause: calling hooks inside if/loops.
   - Fix: call hooks unconditionally; extract conditional logic to child components or custom hooks.

5. Missing dependencies (ESLint warning)
   - Fix: include used variables in deps or restructure effect to avoid referencing changing values.

---

## 8. References

- React docs (hooks): https://react.dev/reference/react  
- Dan Abramov: "A Complete Guide to useEffect" — overreacted.io  
- JSONPlaceholder (API used in examples): https://jsonplaceholder.typicode.com/  
- React DevTools extension

---

## 9. Deliverables & How to Submit

- Files to include in repo:
  - README.md (run instructions)
  - documentation.md (this file)
  - state.md (detailed guide; already present)
  - src/examples/* (Counter.jsx, UserFetcher.jsx, TodoUseReducer.jsx)
- Commit to GitHub or ZIP the project. Ensure README contains `npm install` and `npm run dev`.

---

## 10. Short Checklist (for validator)

- [ ] Repo builds and `npm run dev` starts site  
- [ ] Counter example works and demonstrates functional updates  
- [ ] UserFetcher fetches and handles loading/error/abort  
- [ ] TodoUseReducer shows add/remove via useReducer  
- [ ] documentation.md and state.md present with prompts and fixes recorded

---

## Notes & Best Practices (short)
- Always think: "Is this state local or shared?" Lift up or use Context accordingly.  
- Prefer functional updates when the new value depends on previous state.  
- Add cleanup to effects for timers, listeners, and network requests.  
- Use ESLint hooks plugin — it warns about missing dependencies and common mistakes.

---

End of documentation — paste this file as `documentation.md` in your project root and update README with run instructions.