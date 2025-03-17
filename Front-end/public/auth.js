document.getElementById('registerButton').addEventListener('click', async function (register) {
  console.log('Register button clicked'); // Log to confirm button click
  register.preventDefault();

  const username = document.getElementById('registerusername').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('registerpassword1').value;
  const confirmPassword = document.getElementById('registerpassword2').value;

  const registerError = document.getElementById('registerError');

  // Validate password match
  if (password !== confirmPassword) {
    registerError.innerHTML = 'Passwords do not match';
    return;
  };

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    registerError.innerHTML = 'Invalid email';
    return;
  };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      registerError.innerHTML = 'User registered successfully';
    } else {
      registerError.innerHTML = result.error || 'An error occurred, Please try again';
    }
  } catch (err) {
    console.error('Error during registration:', err); // Log any errors
    registerError.innerHTML = 'An error occurred, Please try again';
  }
});

document.getElementById('loginButton').addEventListener('click', async function (login) {
  console.log('Login button clicked'); // Log to confirm button click
  login.preventDefault();

  const username = document.getElementById('loginusername').value;
  const password = document.getElementById('loginpassword').value;

  const loginError = document.getElementById('loginError');

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
      loginError.innerHTML = 'Login successful';
      loginError.classList.remove('hidden');
    } else {
      loginError.innerHTML = result.error || 'Invalid username or password';
      loginError.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error during login:', err); // Log any errors
    loginError.innerHTML = 'An error occurred, Please try again';
    loginError.classList.remove('hidden');
  }
});
