// Function to fetch and display a fun fact
async function loadFunFact() {
  const displayElement = document.getElementById("funFactDisplay");
  const button = document.getElementById("getFunFact");
  
  // Increment click count and check for easter egg
  clickCount++;
  if (clickCount === 4 && !easterEggTriggered) {
    easterEggTriggered = true;
    createConfetti();
    showSpecialMessage();
  }
  
  // Disable button during loading
  button.disabled = true;
  
  // Fade out current content and show spinner
  displayElement.classList.remove('fade-in');
  displayElement.style.opacity = '0';
  
  setTimeout(() => {
    displayElement.innerHTML = '<div class="loading-spinner"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    displayElement.style.opacity = '1';
  }, 200);

  try {
    // Start timing to ensure minimum loading time
    const startTime = Date.now();
    
    const response = await fetch("/api/funfact");
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate remaining time to reach minimum loading duration
    const elapsedTime = Date.now() - startTime;
    const minimumLoadingTime = 800; // 800ms minimum loading time
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
    
    // Show the fact with smooth transition after minimum time
    setTimeout(() => {
      displayElement.style.opacity = '0';
      
      setTimeout(() => {
        displayElement.textContent = data.funfact || "No fun fact available.";
        displayElement.classList.add('fade-in');
        displayElement.style.opacity = '1';
        button.disabled = false;
      }, 200);
    }, remainingTime);
    
  } catch (error) {
    displayElement.innerHTML = `<span style="color: #e74c3c;">Error: ${error.message}</span>`;
    displayElement.classList.add('fade-in');
    displayElement.style.opacity = '1';
    button.disabled = false;
  }
}

// Track click count for easter egg
let clickCount = 0;
let easterEggTriggered = false;

// Create confetti effect
function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
  const confettiCount = 150;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => confetti.remove(), 5000);
    }, i * 10);
  }
}

// Show special message
function showSpecialMessage() {
  const popup = document.createElement('div');
  popup.className = 'special-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h2>🎉 Congratulations! 🎉</h2>
      <p>You won a fun fact award</p>      
      <p>You must really love fun facts!</p>
      <button onclick="this.parentElement.parentElement.remove()">Awesome!</button>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Auto-remove after 10 seconds
  setTimeout(() => popup.remove(), 10000);
}

// Load a fun fact when the page loads
window.addEventListener('DOMContentLoaded', async () => {
  const displayElement = document.getElementById("funFactDisplay");
  
  // Show loading spinner immediately
  displayElement.innerHTML = '<div class="loading-spinner"></div>';
  
  try {
    const response = await fetch("/api/funfact");
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Show the initial fact with fade-in animation
    setTimeout(() => {
      displayElement.textContent = data.funfact || "No fun fact available.";
      displayElement.classList.add('fade-in');
    }, 500);
    
  } catch (error) {
    displayElement.innerHTML = `<span style="color: #e74c3c;">Error loading initial fact: ${error.message}</span>`;
    displayElement.classList.add('fade-in');
  }
});

// Add click event listener to button
document.getElementById("getFunFact").addEventListener("click", loadFunFact);