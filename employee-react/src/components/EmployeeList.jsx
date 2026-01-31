import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees, deleteEmployee, deleteBatchEmployees } from '../features/employees/employeeSlice';
import { Link } from 'react-router-dom';
import { UserPlus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { data: employees, status, error } = useSelector((state) => state.employees);

    // State for Checkbox Selection
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [status, dispatch]);

    // 1. Handle Individual Delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this employee?")) {
            dispatch(deleteEmployee(id));
        }
    };

    // 2. Handle Batch Delete
    const handleBatchDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} employees?`)) {
            dispatch(deleteBatchEmployees(selectedIds))
                .unwrap()
                .then(() => {
                    setSelectedIds([]); // Clear selection after successful delete
                });
        }
    };

    // 3. Toggle Individual Checkbox
    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 4. Toggle "Select All" Checkbox
    const toggleSelectAll = () => {
        if (selectedIds.length === employees.length) {
            setSelectedIds([]); // Deselect all
        } else {
            setSelectedIds(employees.map(emp => emp.id)); // Select all
        }
    };

    // Helper for Avatar Initials
    const getInitials = (first, last) => `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

    // Helper for Random Colors
    const getRandomColor = (id) => {
        const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600'];
        return colors[id % colors.length];
    };

    let content;

    if (status === 'loading') {
        content = (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    } else if (status === 'failed') {
        content = (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded shadow-sm">
                <div className="flex">
                    <p className="text-sm text-red-700 font-medium">Error loading data: {error}</p>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Checkbox Header */}
                            <th scope="col" className="px-6 py-4 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                                    checked={employees.length > 0 && selectedIds.length === employees.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((emp) => (
                            <tr key={emp.id} className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${selectedIds.includes(emp.id) ? 'bg-blue-50' : ''}`}>
                                {/* Checkbox Row */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                                        checked={selectedIds.includes(emp.id)}
                                        onChange={() => toggleSelect(emp.id)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${getRandomColor(emp.id)}`}>
                                            {getInitials(emp.firstName, emp.lastName)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                                            <div className="text-sm text-gray-500">ID: #{emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {emp.role || 'Employee'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {emp.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            to={`/edit-employee/${emp.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(emp.id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {employees.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">
                            <UserPlus className="mx-auto h-12 w-12 opacity-20" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new employee.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Team Members</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage your employees, their roles, and account permissions.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* CONDITIONAL BATCH DELETE BUTTON */}
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleBatchDelete}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors animate-fadeIn"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search employees..."
                            />
                        </div>

                        <Link
                            to="/add-employee"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Member
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                {content}
            </div>
        </div>
    );
};

export default EmployeeList;
