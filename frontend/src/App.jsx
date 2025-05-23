import { useState } from 'react'

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');

    try {
      const response = await fetch('http://localhost:3100/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`User registered: ${data.name}`);
        setName('');
        setPassword('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Register</h2>

    <div>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
    </div>

    <div>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
    </div>

    <button type="submit">Register</button>

    {message && <p>{message}</p>}
  </form>
  )
}

export default App
