import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../features/employees/employeeSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const EmployeeForm = () => {
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const existingEmployee = useSelector((state) =>
        id ? state.employees.data.find((emp) => emp.id === parseInt(id)) : null
    );

    useEffect(() => {
        if (existingEmployee) {
            setEmployee({
                ...existingEmployee,
                password: '' // Keep UI clean
            });
        }
    }, [existingEmployee]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (id) {

            const updatePayload = {
                ...employee,
                password: "********"
            };

            dispatch(updateEmployee({ id, employee: updatePayload }));
        } else {
            // ADD MODE
            // Send the actual password typed by the user
            dispatch(addEmployee(employee));
        }
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {id ? 'Edit Employee' : 'Add New Employee'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={employee.firstName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={employee.lastName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    value={employee.email}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <div className="mt-1">
                                <select
                                    name="role"
                                    value={employee.role}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="USER">USER</option>
                                    <option value="JAVA_DEV">JAVA_DEV</option>
                                    <option value="SENIOR_DEV">SENIOR_DEV</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        </div>

                        {/* Password - Only show if ADDING a new user */}
                        {!id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="password"
                                        value={employee.password}
                                        onChange={handleChange}
                                        required={!id} // Only required when adding
                                        minLength={6}
                                        placeholder="Min 6 characters"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {id ? 'Update' : 'Save'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeForm;
