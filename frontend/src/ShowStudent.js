import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Table, Button, ButtonGroup } from 'react-bootstrap'

const ShowStudent = () => {
  const [users, setUsers] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    const showUsers = async () => {
      try {
        let url = 'backend-url/show'
        let res = await axios.get(url)
        setUsers(res.data)
        console.log(res.data)
      } catch (err) {
        console.error('Error is :' + err)
        setErr('Error is : ' + err.message)
      }
    }
    showUsers()
  }, [])

  const hDelete = (r_no) => {
    try {
      let url = `backend-url/delete/${r_no}`
      const res = axios.delete(url)
      setUsers(users.filter((user) => user.r_no !== r_no))
    } catch (err) {
      console.error(err)
      setErr('Error while deleting data : ' + err.message)
    }
  }

  return (
    <center>
      <div className="table">
        <h1>User Data</h1>
        <Link to="/" className="link">
          <h6>Home</h6>
        </Link>
        <Table striped bordered hover responsive size="sm" variant="dark">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Marks</th>
              <th>Images</th>
              <th>Action/Operation</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.r_no}>
                  <td>{user.r_no}</td>
                  <td>{user.name}</td>
                  <td>{user.marks}</td>
                  <td>
                    <img
                      src={`https://crud-mysql-task-3-3.onrender.com/${user.img}`}
                      alt={user.name}
                      width="50"
                      height="50"
                    />
                  </td>
                  <td>
                    <Link to={`/update/${user.r_no}`} className="btn2">
                      <Button variant="outline-primary">Edit</Button>
                    </Link>{' '}
                    <Link>
                      <Button
                        variant="outline-danger"
                        className="btn1"
                        onClick={() => hDelete(user.r_no)}
                      >
                        Delete
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
        {err && <p>{err}</p>}
      </div>
    </center>
  )
}

export default ShowStudent
