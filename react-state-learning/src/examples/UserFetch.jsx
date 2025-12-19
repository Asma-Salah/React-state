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
