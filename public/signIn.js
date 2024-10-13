function validateUser(event){
    event.preventDefault();

    document.getElementById('email1_error').innerHTML = '';
    document.getElementById('password1_error').innerHTML = '';
    
    const email1 = document.getElementById('email1').value.trim();
    const password1 = document.getElementById('password1').value.trim();
    
    let isValid = true;

    
    if (email1 === '') {
        document.getElementById('email1_error').innerHTML = 'Input email';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1)) {
        document.getElementById('email1_error').innerHTML = 'Invalid email format';
        isValid = false;
    }

    
    if (password1 === '') {
        document.getElementById('password1_error').innerHTML = 'Input password';
        isValid = false;
    }
    else if(password1.length <8){
        document.getElementById('password1_error').innerHTML = 'Password is too short';
        isValid = false
    }

    if (isValid) {
        const formData = { email: email1, password: password1 }; // Adjust based on your backend

        fetch('/auth/signIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                if (data.message === 'Log in successful') {
                    window.location.href = '/appointments'; 
                }
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        });
    }
}




document.getElementById('form1').addEventListener('submit', validateUser);