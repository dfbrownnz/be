
// npm init -y
// npm install express cors

// Node.js backend (Express)
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

// Enable CORS for React frontend
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node!' });
});

app.get('/todo', (req, res) => {
  const cwd = process.cwd();
  // Accessing environment details using Node.js's 'process' global object
  const envInfo = {
    // Current working directory
    cwd: process.cwd(),
    
    // Node.js version
    nodeVersion: process.version,
    
    // Operating System Platform (e.g., 'linux', 'win32')
    platform: process.platform,
    
    // Process ID
    pid: process.pid,

    // Example of a specific environment variable (use with caution)
    // pathEnv: process.env.PATH, 
  };

  res.json({ message: 'Hello from todo!', myMsg : envInfo , files : fs.readdirSync(cwd) });
});


app.listen(4000, () => {
  console.log('localhost:4000 running on port 4000');
});

