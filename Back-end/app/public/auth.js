document.getElementById('registerContainer').addEventListener('submit', async function (register) {
  register.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('registerPassword1').value;
  const confirmPassword = document.getElementById('registerPassword2').value;

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
    const response = await fetch('http://backend:300/register', {
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
    registerError.innerHTML = 'An error occurred, Please try again';
  }
});
