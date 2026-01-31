import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-blue-600 p-4 text-white shadow-md">
          <div className="container mx-auto font-bold text-xl">
            Employee Management System
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add-employee" element={<EmployeeForm />} />
          <Route path="/edit-employee/:id" element={<EmployeeForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
