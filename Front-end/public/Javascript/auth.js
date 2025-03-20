document.getElementById('registerButton').addEventListener('click', async function (register) {
  register.preventDefault();

  const username = document.getElementById('registerusername').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('registerpassword1').value;
  const confirmPassword = document.getElementById('registerpassword2').value;

  const registerError = document.getElementById('registerError');

  // Validate password match
  if (password !== confirmPassword) {
    registerError.innerHTML = 'Passwords do not match';
    registerError.classList.remove('hidden');
    return;
  };

  // Validate password length
  if (password.length < 6) {
    registerError.innerHTML = 'Password must be at least 6 characters long';
    registerError.classList.remove('hidden');
    return;
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    registerError.innerHTML = 'Invalid email';
    registerError.classList.remove('hidden');
    return;
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      registerError.innerHTML = 'User registered successfully';
      registerError.classList.remove('hidden');
    } else {
      registerError.innerHTML = result.error || 'An error occurred, Please try again';
      registerError.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error during registration:', err);
    registerError.innerHTML = 'An error occurred, Please try again';
    registerError.classList.remove('hidden');
  }
});

document.getElementById('loginButton').addEventListener('click', async function (login) {
  login.preventDefault();

  const username = document.getElementById('loginusername').value;
  const password = document.getElementById('loginpassword').value;

  const loginError = document.getElementById('loginError');

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('username', username);
      loginError.innerHTML = 'Login successful';
      loginError.classList.remove('hidden');
      window.location.href = 'game.html';
    } else {
      loginError.innerHTML = result.error || 'Invalid username or password';
      loginError.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error during login:', err);
    loginError.innerHTML = 'An error occurred, Please try again';
    loginError.classList.remove('hidden');
  }
});
