// Function to validate the registration form
function validateForm(event) {
    event.preventDefault(); 


    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const password2 = document.getElementById('password2').value.trim();
    const date_of_birth = document.getElementById('date_of_birth').value.trim();
    const address = document.getElementById('address').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const terms = document.getElementById('terms').checked;
    const contactEmail = document.getElementById('contactEmail').checked;
    const contactPhone = document.getElementById('contactPhone').checked;

    let isValid = true;
    const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/;
    const phoneFormat = /^\+?\d{10,15}$/;

    // Validate fields
    if (fname === '') {
        document.getElementById('fname_error').innerHTML = 'Please insert your first name';
        isValid = false;
    }

    if (lname === '') {
        document.getElementById('lname_error').innerHTML = 'Please insert your last name';
        isValid = false;
    }

    if (username === '') {
        document.getElementById('username_error').innerHTML = 'Please input your username';
        isValid = false;
    }

    if (email === '') {
        document.getElementById('email_error').innerHTML = 'Please input your email';
        isValid = false;
    } else if (!emailFormat.test(email)) {
        document.getElementById('email_error').innerHTML = 'Input email in the correct format';
        isValid = false;
    }

    if (phone === '') {
        document.getElementById('phone_error').innerHTML = 'Please input your phone number';
        isValid = false;
    } else if (!phoneFormat.test(phone)) {
        document.getElementById('phone_error').innerHTML = 'Input phone number in the correct format';
        isValid = false;
    } else if (phone.length < 10) {
        document.getElementById('phone_error').innerHTML = 'Phone number is too short';
        isValid = false;
    }

    if (password === '') {
        document.getElementById('password_error').innerHTML = 'Please input your password';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('password_error').innerHTML = 'Password is too short';
        isValid = false;
    }

    if (password2 !== password) {
        document.getElementById('password2_error').innerHTML = 'Passwords do not match!';
        isValid = false;
    }

    if (date_of_birth === '') {
        document.getElementById('date_of_birth_error').innerHTML = 'Please insert your date of birth';
        isValid = false;
    }

    if (address === '') {
        document.getElementById('address_error').innerHTML = 'Please insert your address';
        isValid = false;
    }

    if (gender === '') {
        document.getElementById('gender_error').innerHTML = 'Please insert your gender';
        isValid = false;
    }

    if (!terms) {
        document.getElementById('terms_error').innerHTML = 'Please check terms and conditions';
        isValid = false;
    }

    if(!contactEmail && !contactPhone){
        document.getElementById('contactMethod_error').innerHTML = 'Please input your prefered contact';
        isValid = false
    }


    // If the form is valid, send data to the server
    if (isValid) {
        const formData = {
            fname,
            lname,
            username,
            email,
            phone,
            password,
            date_of_birth,
            address,
            gender
        };

        fetch('/auth/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                if (data.message === 'User registered successfully!') {
                    window.location.href = '/signIn'; 
                }
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert('An error occurred during registration.');
        });
    }
}


// Function to update the summary section as the user types
function updateSummary() {
    const fname = document.getElementById('fname').value.trim() || 'Not provided';
    const lname = document.getElementById('lname').value.trim() || 'Not provided';
    const username = document.getElementById('username').value.trim() || 'Not provided';
    const email = document.getElementById('email').value.trim() || 'Not provided';
    const phone = document.getElementById('phone').value.trim() || 'Not provided';

    document.getElementById('summaryFName').textContent = fname;
    document.getElementById('summaryLName').textContent = lname;
    document.getElementById('summaryUsername').textContent = username;
    document.getElementById('summaryEmail').textContent = email;
    document.getElementById('summaryPhone').textContent = phone;
}


// Add event listeners for real-time validation and summary updates
// document.getElementById('fname').addEventListener('input', (event) => handleInputChange(event, 'fname_error'));
// document.getElementById('lname').addEventListener('input', (event) => handleInputChange(event, 'lname_error'));
// document.getElementById('username').addEventListener('input', (event) => handleInputChange(event, 'username_error'));
// document.getElementById('email').addEventListener('input', (event) => handleInputChange(event, 'email_error'));
// document.getElementById('phone').addEventListener('input', (event) => handleInputChange(event, 'phone_error'));
// document.getElementById('password').addEventListener('input', (event) => handleInputChange(event, 'password_error'));
// document.getElementById('password2').addEventListener('input', (event) => handleInputChange(event, 'password2_error'));
// document.getElementById('date_of_birth').addEventListener('input', (event) => handleInputChange(event, 'date_of_birth_error'));
// document.getElementById('address').addEventListener('input', (event) => handleInputChange(event, 'address_error'));
// document.getElementById('terms').addEventListener('change', () => clearError('terms_error'));
// document.getElementById('contactEmail').addEventListener('change', () => clearError('contactMethod_error'));
// document.getElementById('contactPhone').addEventListener('change', () => clearError('contactMethod_error'));

// Add event listeners for updating the summary as the user types
document.getElementById('fname').addEventListener('input', updateSummary);
document.getElementById('lname').addEventListener('input', updateSummary);
document.getElementById('username').addEventListener('input', updateSummary);
document.getElementById('email').addEventListener('input', updateSummary);
document.getElementById('phone').addEventListener('input', updateSummary);

// Add event listeners for form submission
document.getElementById('form').addEventListener('submit', validateForm);



