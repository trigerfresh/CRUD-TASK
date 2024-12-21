const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

// MySQL connection
const db = mysql.createConnection({
  host: 'byqybtse6xsiseomuimw-mysql.services.clever-cloud.com',
  user: 'uc00kwucue7cp4al',
  password: 'liZB4y7HqIPy1aw0yGy1',
  database: 'byqybtse6xsiseomuimw',
});

db.connect(err => {
  if (err) return console.log('Error connecting to Mysql: ', err);
  console.log('Connected to mysql');
});

// Helper function for handling database queries
const queryDB = (query, params, res, successMessage) => {
  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Error: ${successMessage}` });
    }
    res.status(successMessage === 'fetched' ? 200 : 201).json({
      message: successMessage,
      data: result || undefined,
    });
  });
};

// Routes
app.post('/students', upload.single('img'), (req, res) => {
  const { r_no, name, marks } = req.body;
  const img = req.file ? req.file.path : null;
  queryDB(
    'INSERT INTO students(r_no, name, marks, img) VALUES (?, ?, ?, ?)',
    [r_no, name, marks, img],
    res,
    'Student created successfully'
  );
});

app.get('/show', (_, res) => {
  queryDB('SELECT * FROM students', [], res, 'fetched');
});

app.delete('/delete/:r_no', (req, res) => {
  queryDB('DELETE FROM students WHERE r_no = ?', [req.params.r_no], res, 'Student deleted successfully');
});

app.put('/update/:r_no', upload.single('img'), (req, res) => {
  const { r_no } = req.params;
  const { name, marks } = req.body;
  const img = req.file ? req.file.path : null;

  db.query('SELECT img FROM students WHERE r_no = ?', [r_no], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error retrieving student data' });

    const oldImagePath = result[0]?.img;
    let query = 'UPDATE students SET name = ?, marks = ?';
    const params = [name, marks];

    if (img) {
      query += ', img = ?';
      params.push(img);
      if (oldImagePath) {
        fs.unlink(path.join(__dirname, oldImagePath), (err) => {
          if (err) console.log('Error deleting old image:', err);
          else console.log('Old image deleted');
        });
      }
    }

    query += ' WHERE r_no = ?';
    params.push(r_no);

    queryDB(query, params, res, 'Student updated successfully');
  });
});

app.get('/show/:r_no', (req, res) => {
  queryDB('SELECT * FROM students WHERE r_no = ?', [req.params.r_no], res, 'Student data fetched');
});

// Start server
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
});
