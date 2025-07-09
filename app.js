const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Import fun facts from external file
const funFacts = require('./funfacts');

// Function to get a random fun fact
function getRandomFunFact() {
  return funFacts[Math.floor(Math.random() * funFacts.length)];
}

// API endpoint that returns a random fun fact
app.get('/api/funfact', (req, res) => {
  res.json({
    funfact: getRandomFunFact()
  });
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('App listening on port ' + port);
});