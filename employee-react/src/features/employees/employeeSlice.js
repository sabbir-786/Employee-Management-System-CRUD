import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ==========================================
// Async Thunks (API Calls)
// ==========================================

// 1. Fetch All Employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch employees');
    }
});

// 2. Add Employee
export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee, { rejectWithValue }) => {
    try {
        const response = await api.post('/register', employee);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to add employee');
    }
});

// 3. Update Employee
export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, employee }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/${id}`, employee);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update employee');
    }
});

// 4. Delete Single Employee
export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete employee');
    }
});

// 5. Batch Delete (FIXED: Switched to POST)
// POST http://localhost:8080/api/employees/batch/delete
export const deleteBatchEmployees = createAsyncThunk('employees/deleteBatch', async (ids, { rejectWithValue }) => {
    try {
        // We use POST now for better reliability with lists
        await api.post('/batch/delete', ids);
        return ids;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to batch delete');
    }
});

// ==========================================
// Slice (State Management)
// ==========================================

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Fetch ---
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })

            // --- Add ---
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.error = action.payload; // Capture backend error
            })

            // --- Update ---
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.data.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            // --- Delete Single ---
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.data = state.data.filter(emp => emp.id !== action.payload);
            })

            // --- Delete Batch ---
            .addCase(deleteBatchEmployees.fulfilled, (state, action) => {
                // Remove all employees whose ID is in the payload list
                state.data = state.data.filter(emp => !action.payload.includes(emp.id));
            });
    }
});

export default employeeSlice.reducer;
