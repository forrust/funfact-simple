// Function to fetch and display a fun fact
async function loadFunFact() {
  const displayElement = document.getElementById("funFactDisplay");
  const button = document.getElementById("getFunFact");
  
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