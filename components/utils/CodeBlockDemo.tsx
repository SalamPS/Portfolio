'use client'

import { CodeBlock } from './CodeBlock'

export const CodeBlockDemo = () => {
  const jsCode = `
import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return (
    <div className="App">
      <h1>Hello React!</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default App;
`.trim()

  const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt

def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Generate and plot Fibonacci sequence
numbers = fibonacci(20)
plt.plot(numbers, 'bo-')
plt.title('Fibonacci Sequence')
plt.xlabel('Index')
plt.ylabel('Value')
plt.show()
`.trim()

  const sqlCode = `
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query to get all published posts with author info
SELECT 
    p.title,
    p.content,
    u.username AS author,
    p.created_at
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.published = TRUE
ORDER BY p.created_at DESC;
`.trim()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">CodeBlock Demo</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">JavaScript/React Code (app.jsx)</h2>
          <CodeBlock code={jsCode} language="javascript" filename="app.jsx" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Python Code (fibonacci.py)</h2>
          <CodeBlock code={pythonCode} language="python" filename="fibonacci.py" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">SQL Code (schema.sql)</h2>
          <CodeBlock code={sqlCode} language="sql" filename="schema.sql" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Plain Text (No Highlighting)</h2>
          <CodeBlock 
            code="This is just plain text without any syntax highlighting.
It will still have the copy button and styling though!" 
            language="text" 
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBlockDemo
