// Importing required modules
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3004;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uri = process.env.mongourl;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;
database.on('error', (error) => {
    console.error('Database connection error:', error);
});
database.once('connected', () => {
    console.log('Database Connected');
});

// Mongoose model
const sample = require('./Models/create');

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the add employee page
app.get('/employee', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'employee.html'));
});

// Serve the view employee page
app.get('/employee/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewemployee.html'));
});

// Serve the update employee page
app.get('/update/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'updateemployee.html'));
});

// Serve the delete employee page
app.get('/delete/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'deleteemployee.html'));
});

// Handle adding a new employee (POST)
app.post('/api/employee', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const details = await sample.create(data);
        res.status(201).send('Employee added successfully');
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Error adding employee');
    }
});

// Handle getting employee details by ID (GET)
app.get('/api/employee/:id', async (req, res) => {
    try {
        const employee = await sample.findOne({ EmployeeID: req.params.id });
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).send('Error fetching employee');
    }
});

// Handle updating an employee (PUT)
app.put('/api/employee/:id', async (req, res) => {
    try {
        const { name, position } = req.body;
        const updatedEmployee = await sample.findOneAndUpdate(
            { EmployeeID: req.params.id },
            { name, position },
            { new: true }
        );
        if (updatedEmployee) {
            res.send('Employee updated successfully');
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Error updating employee');
    }
});

// Handle deleting an employee (DELETE)
app.delete('/api/employee/:id', async (req, res) => {
    try {
        const deletedEmployee = await sample.findOneAndDelete({ EmployeeID: req.params.id });
        if (deletedEmployee) {
            res.send('Employee deleted successfully');
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Error deleting employee');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
