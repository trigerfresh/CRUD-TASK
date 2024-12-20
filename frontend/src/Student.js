import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'

const Student = () => {
  const [r_no, setRno] = useState('')
  const [name, setName] = useState('')
  const [marks, setMarks] = useState('')
  const [image, setImage] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const hrNo = (e) => {
    setRno(e.target.value)
  }
  const hName = (e) => {
    setName(e.target.value)
  }
  const hMarks = (e) => {
    setMarks(e.target.value)
  }
  const hImage = (e) => {
    setImage(e.target.files[0])
  }

  const hForm = (e) => {
    e.preventDefault()

    if (r_no === '') {
      setErr('Enter roll number')
      return
    }

    if (name === '') {
      setErr('Enter name')
      return
    }

    if (marks === '') {
      setErr('Enter marks')
      return
    }

    if (image === '') {
      setErr('Select Image')
      return
    }
    const formData = new FormData()
    formData.append('r_no', r_no)
    formData.append('name', name)
    formData.append('marks', marks)
    formData.append('img', image)

    let url = 'backend-url/students'
    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data)
        setMsg('Data stored successful')
        setRno('')
        setMarks('')
        setName('')
        setErr('')
      })
      .catch((error) => {
        console.error(error)
        setErr('Error is : ' + err.message)
      })
  }

  return (
    <div className="form" style={{ height: '550px' }}>
      <Container style={{ width: '30%' }}>
        <Row className="justify-content-center bg-primary bg-gradient rounded text-light mt-5">
          <Col className="mt-2">
            <h1>Form Application</h1>
            <Link to="/show" className="txt">
              User List
            </Link>
            <Form onSubmit={hForm} className="mt-2">
              <Form.Group className="m-3">
                <Form.Control
                  type="number"
                  value={r_no}
                  onChange={hrNo}
                  placeholder="Enter roll number"
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Control
                  type="text"
                  value={name}
                  onChange={hName}
                  placeholder="Enter name"
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Control
                  type="number"
                  value={marks}
                  onChange={hMarks}
                  placeholder="Enter marks"
                />
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Control type="file" onChange={hImage} />
              </Form.Group>

              <Button type="submit" variant="dark" className=".btn">
                Save
              </Button>
            </Form>
            {err && (
              <Alert className="bg-danger text-light text-center">{err}</Alert>
            )}
            {msg && (
              <Alert className="bg-primary text-light text-center">{msg}</Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Student
