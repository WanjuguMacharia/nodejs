const db = require('../config/db');
const bcrypt = require('bcryptjs');

// signUp logic
exports.signUp = async (req, res) => {
  const { fname, lname, username, email, phone, password, date_of_birth, address, gender } = req.body;

  // console.log('Received registration data:', req.body);

  try {
    // Check if the patient already exists
    const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new patient into the database
    await db.execute(
      'INSERT INTO patients (first_name, last_name, username, email, phone, password_hash, date_of_birth, address, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [fname, lname, username, email, phone, hashedPassword, date_of_birth, address, gender]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'An error occurred during registration.', error });
  }
};

// signIn logic
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for the patient's email
    const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      // Store user details in the session for logged-in status
      req.session.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      console.log('Session set:', req.session);

      // Save the session before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).json({ message: 'Session error' });
        }
        console.log('Session saved and redirecting');
        res.status(200).json({ message: 'Log in successful', user: req.session.user });
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'An error occurred during login.', error });
  }
};

// logout logic
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Could not log out.' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

exports.addDoctor = async (req, res) => {
  const { firstName, lastName, specialization, email, phone, schedule } = req.body;
  try {
      await db.execute(
          'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
          [firstName, lastName, specialization, email, phone, schedule]
      );
      res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error adding doctor', error });
  }
};

exports.getDoctors = async (req, res) => {
  try {
      const [rows] = await db.execute('SELECT * FROM doctors');
      res.status(200).json({ doctors: rows });
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving doctors', error });
  }
};

exports.bookAppointment = async (req, res) => {
  const { patientId,doctorId, date, time } = req.body;
  try {
      await db.execute(
          'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
          [patientId, doctorId, date, time, 'scheduled']
      );
      res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error booking appointment', error });
  }
};

exports.getAppointments = async (req, res) => {
  try {
      const [rows] = await db.execute('SELECT * FROM appointments');
      res.status(200).json({ appointments: rows });
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};