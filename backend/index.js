const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

const db = mysql.createConnection({
  host: 'byqybtse6xsiseomuimw-mysql.services.clever-cloud.com',
  user: 'uc00kwucue7cp4al',
  password: 'liZB4y7HqIPy1aw0yGy1',
  database: 'byqybtse6xsiseomuimw',
})

db.connect((err) => {
  if (err) {
    console.log('Error connecting to Mysql: ', err)
  } else {
    console.log('Connected to mysql')
  }
})

app.post(baseUrl + '/students', upload.single('img'), (req, res) => {
  const { r_no, name, marks } = req.body
  const img = req.file ? req.file.path : null

  const query =
    'INSERT INTO students(r_no, name, marks, img) VALUES (?, ?, ?, ?)'

  db.query(query, [r_no, name, marks, img], (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: 'Error creating student.' })
    } else {
      res.status(201).json({ message: 'Student created successful' })
    }
  })
})

app.get('/show', (req, res) => {
  // Query to fetch all students from the database
  db.query('SELECT * FROM students', (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error fetching students' })
    }

    res.status(200).json(result) // result will contain all students
  })
})

app.delete('/delete/:r_no', (req, res) => {
  const { r_no } = req.params
  db.query('DELETE FROM students WHERE r_no = ?', [r_no], (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ message: 'Error deleting student' })
    } else {
      res.status(200).json({ message: 'Student deleted successfully' })
    }
  })
})

app.put('/update/:r_no', upload.single('img'), (req, res) => {
  const { r_no } = req.params
  const { name, marks } = req.body
  const img = req.file ? req.file.path : null

  // Query to get the current student data, including the image path
  db.query('SELECT img FROM students WHERE r_no = ?', [r_no], (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: 'Error retrieving student data' })
    }

    const oldImagePath = result[0] ? result[0].img : null

    // Update student data
    let query = 'UPDATE students SET name = ?, marks = ?'
    const params = [name, marks]

    if (img) {
      query += ', img = ?'
      params.push(img)

      // If there's an old image, delete it
      if (oldImagePath) {
        const oldImage = path.join(__dirname, oldImagePath) // Construct the full path to the old image
        fs.unlink(oldImage, (err) => {
          if (err) {
            console.log('Error deleting old image:', err)
          } else {
            console.log('Old image deleted')
          }
        })
      }
    }

    query += ' WHERE r_no = ?'
    params.push(r_no)

    // Execute the update query
    db.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error updating student' })
      }
      res.status(200).json({ message: 'Student updated successfully' })
    })
  })
})

app.get('/show/:r_no', (req, res) => {
  const { r_no } = req.params
  const query = 'SELECT * FROM students WHERE r_no = ?'

  db.query(query, [r_no], (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error fetching student data' })
    }

    if (result.length > 0) {
      return res.json(result[0])
    } else {
      return res.status(404).json({ message: 'Student not found' })
    }
  })
})

app.listen(port, () => {
  console.log(`Server running @ http://localhost:${5000}`)
})
