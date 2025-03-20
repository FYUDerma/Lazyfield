// Save progression to the database
export async function saveProgressionToDB(clickCount, upgrades) {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/state/save', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              username: localStorage.getItem('username'),
              clicks: clickCount,
              upgrades: upgrades
          })
      });

      if (!response.ok) {
          throw new Error('Failed to save progression');
      }

      console.log('Progress saved to the database.');
  } catch (error) {
      console.error('Error saving progression:', error);
  }
}

// Load progression from the database
export async function loadProgressionFromDB() {
  try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      const response = await fetch(`http://localhost:3000/api/state/load/${username}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error('Failed to load progression');
      }

      const data = await response.json();
      console.log('Progress loaded from the database:', data.gameState);
      
      applyLoadedProgression(data.gameState);
  } catch (error) {
      console.error('Error loading progression:', error);
      return null;
  }
}

// Reset progression in the database
export async function resetProgressionInDB() {
  try {
      const token = localStorage.getItem('token'); // Ensure the user is authenticated
      const username = localStorage.getItem('username'); // Assuming username is stored in localStorage

      const response = await fetch(`http://localhost:3000/api/state/reset`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ username })
      });

      if (!response.ok) {
          throw new Error('Failed to reset progression');
      }

      console.log('Progress reset in the database.');
  } catch (error) {
      console.error('Error resetting progression:', error);
  }
}