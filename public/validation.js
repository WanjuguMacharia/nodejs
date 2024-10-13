document.addEventListener('DOMContentLoaded', () => {
    // Validate and handle doctor form submission
    document.getElementById('doctorForm')?.addEventListener('submit', validateDoctorForm);
    // Validate and handle appointment form submission
    document.getElementById('appointmentForm')?.addEventListener('submit', validateAppointmentForm);

    function validateDoctorForm(event) {
        event.preventDefault();
        clearErrors();

        const firstName = document.getElementById('doctor_first_name').value.trim();
        const lastName = document.getElementById('doctor_last_name').value.trim();
        const specialization = document.getElementById('specialization').value.trim();
        const email = document.getElementById('doctor_email').value.trim();
        const phone = document.getElementById('doctor_phone').value.trim();

        let isValid = true;
        if (firstName === '') {
            displayError('doctor_first_name_error', 'Please enter the first name');
            isValid = false;
        }
        if (lastName === '') {
            displayError('doctor_last_name_error', 'Please enter the last name');
            isValid = false;
        }
        if (specialization === '') {
            displayError('specialization_error', 'Please enter a specialization');
            isValid = false;
        }
        if (email === '') {
            displayError('doctor_email_error', 'Please enter an email');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            displayError('doctor_email_error', 'Please enter a valid email');
            isValid = false;
        }
        if (phone === '') {
            displayError('doctor_phone_error', 'Please enter a phone number');
            isValid = false;
        }

        if (isValid) {
            const formData = { firstName, lastName, specialization, email, phone };
            fetch('/doctor/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) alert(data.message);
            })
            .catch(error => console.error('Error adding doctor:', error));
        }
    }

    function validateAppointmentForm(event) {
        event.preventDefault();
        clearErrors();

        const doctorId = document.getElementById('doctor_id').value;
        const date = document.getElementById('appointment_date').value;
        const time = document.getElementById('appointment_time').value;

        let isValid = true;
        if (!doctorId) {
            displayError('doctor_id_error', 'Please select a doctor');
            isValid = false;
        }
        if (!date) {
            displayError('appointment_date_error', 'Please select a date');
            isValid = false;
        }
        if (!time) {
            displayError('appointment_time_error', 'Please select a time');
            isValid = false;
        }

        if (isValid) {
            const formData = { doctorId, date, time };
            fetch('/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) alert(data.message);
            })
            .catch(error => console.error('Error booking appointment:', error));
        }
    }

    function displayError(id, message) {
        const errorElement = document.getElementById(id);
        if (errorElement) errorElement.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
});
