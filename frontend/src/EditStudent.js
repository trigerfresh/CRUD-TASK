import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Image,
  Alert,
} from 'react-bootstrap'

const EditStudent = () => {
  const { r_no } = useParams()
  const [student, setStudent] = useState({ name: '', marks: '', img: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `backend-url/show/${r_no}`
        const res = await axios.get(url)
        setStudent(res.data)
        console.log(res.data)
      } catch (err) {
        console.error('Error fetching student data:', err)
        setErr('Error fetching student data: ' + err.message)
      }
    }
    fetchData()
  }, [r_no])

  const hForm = async (e) => {
    e.preventDefault()

    if (r_no === '') {
      setErr('Enter roll number')
      return
    }

    if (student.name === '') {
      setErr('Enter name')
      return
    }

    if (student.marks === '') {
      setErr('Enter marks')
      return
    }

    const formData = new FormData()
    formData.append('name', student.name)
    formData.append('marks', student.marks)

    if (student.img) formData.append('img', student.img)

    try {
      let url = `https://crud-mysql-task-3-3.onrender.com/update/${r_no}`
      const res = await axios.put(url, formData)
      console.log(res.data)
      navigate('/show')
    } catch (err) {
      console.error('Error updating student:', err)
      setErr('Error updating student: ' + err.message)
    }
  }
  return (
    <div className="edit-form" style={{ height: '550px', width: 'auto%' }}>
      <Container style={{ width: '30%' }}>
        <div className="editForm">
          <Row className="justify-content-center bg-primary bg-gradient rounded text-light">
            <Col>
              <h1>Edit Data</h1>
              <Form onSubmit={hForm}>
                <Form.Group className="m-3">
                  <Form.Control
                    type="number"
                    value={student.r_no}
                    onChange={(e) =>
                      setStudent({ ...student, r_no: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="m-3">
                  <Form.Control
                    type="name"
                    value={student.name}
                    onChange={(e) =>
                      setStudent({ ...student, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="m-3">
                  <Form.Control
                    type="number"
                    value={student.marks}
                    onChange={(e) =>
                      setStudent({ ...student, marks: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="m-3">
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      setStudent({ ...student, img: e.target.files[0] })
                    }
                  />
                </Form.Group>

                {student.img && (
                  <div>
                    <Image
                      src={`https://crud-mysql-task-3-3.onrender.com/${student.img}`}
                      alt="Upload new Image"
                      width="50"
                      height="50"
                      className="pre-img"
                      rounded
                    />
                    <br />
                  </div>
                )}

                <Button type="submit" className="update-btn" variant="success">
                  Update Student
                </Button>
              </Form>
              {err && (
                <Alert className="bg-danger text-light text-center">
                  {err}
                </Alert>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default EditStudent
