import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Student from './Student.js';
import ShowStudent from './ShowStudent.js';
import EditStudent from './EditStudent.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    	<BrowserRouter>
		<Routes>
			<Route path = '/' element = {<Student/>}/>
			<Route path = '/show' element = {<ShowStudent/>}/>
			<Route path = '/update/:r_no' element = {<EditStudent/>}/>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
