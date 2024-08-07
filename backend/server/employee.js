const { v4: uuidv4 } = require('uuid');
const dbConnectionPool = require('./db.js');
const express = require('./parent.js');
const { authenticateToken } = require('./tokenValidation');
const employeeAPIs = express.Router();
const hashGenerator = require('./hashGenerator.js');


// Apply token authentication middleware to all employee APIs
employeeAPIs.use(authenticateToken);

// Insert data into the "empdata" and "empcred" tables
employeeAPIs.post("/", async (req, res) => {
    console.log("create employee");
    const empData = req.body;
    console.log(empData);

    // Generate a new UUID for the employee_id and convert it to a string
    const employee_id = uuidv4().toString();
    if (!empData.employee_name || !empData.designation || !empData.phone_number || !empData.email || !empData.username || !empData.password) {
        res.status(400).send("Missing required fields.");
        return;
    }

    try {
        const connection = await dbConnectionPool.getConnection();

        // Insert data into the "empdata" table
        const empDataQuery = {
            text: 'INSERT INTO empdata(employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values: [
                employee_id,
                empData.employee_name,
                empData.designation,
                empData.phone_number,
                empData.email,
                empData.joining_date,
                empData.leaving_date,
                empData.reporting_manager_id,
                empData.address
            ],
        };

        await connection.execute(empDataQuery.text, empDataQuery.values);

        const hashedPassword = await hashGenerator.generate_sha_hash(empData.password);
        console.log("hashed password: " + hashedPassword);

        // Insert data into the "empcred" table
        const empCredQuery = {
            text: 'INSERT INTO empcred(username, password, employee_id) VALUES(?, ?, ?)',
            values: [
                empData.username,
                hashedPassword,
                employee_id
            ],
        };

        await connection.execute(empCredQuery.text, empCredQuery.values);

        connection.release(); // Release the connection back to the pool
        console.log('Data inserted successfully');
        res.send("Entry inserted");
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
});

// Define a route to get employee data
employeeAPIs.get('/', async (req, res) => {
    console.log('Fetching all employees data');
    try {
        const connection = await dbConnectionPool.getConnection();
        const query = 'SELECT employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address FROM empdata';
        const [results] = await connection.execute(query);
        connection.release(); // Release the connection back to the pool
        res.json(results);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('An error occurred while fetching employee data.');
    }
});
// Define a route to get employee data
employeeAPIs.get('/:employee_id', async (req, res) => {
    const employeeId = req.params.employee_id;
    console.log('Fetching data of employee', employeeId);
    try {
        const connection = await dbConnectionPool.getConnection();
        const query = `
            SELECT e.employee_id, e.employee_name, e.designation, e.phone_number, e.email, e.joining_date, 
                   e.leaving_date, e.reporting_manager_id, e.address, c.username
            FROM empdata e
            INNER JOIN empcred c ON e.employee_id = c.employee_id
            WHERE e.employee_id = ?`;
        const [results] = await connection.query(query, [employeeId]);
        connection.release(); // Release the connection back to the pool
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('An error occurred while fetching employee data.');
    }
});

// Define a route to update an employee's information
employeeAPIs.put('/:employee_id', async (req, res) => {
    const employeeId = req.params.employee_id;
    console.log('Updating employee data', employeeId);
    const {
        employee_name,
        designation,
        phone_number,
        email,
        joining_date,
        leaving_date,
        reporting_manager_id,
        address,
        password
    } = req.body;
    console.log('Received data:', req.body);

    if (!employee_name || !designation || !phone_number || !email || !joining_date || !leaving_date || !reporting_manager_id || !address) {
        res.status(400).json({ error: 'Bad request - Missing data' });
        return;
    }

    try {
        const connection = await dbConnectionPool.getConnection();

        // Update empdata table
        const empDataQuery = `
            UPDATE empdata 
            SET employee_name = ?, designation = ?, phone_number = ?, email = ?, 
            joining_date = ?, leaving_date = ?, reporting_manager_id = ?, address = ?
            WHERE employee_id = ?
        `;
        const empDataResult = await connection.query(empDataQuery, [
            employee_name,
            designation,
            phone_number,
            email,
            joining_date,
            leaving_date,
            reporting_manager_id,
            address,
            employeeId
        ]);

        // Update empcred table if password is provided
        if (password) {
            const hashedPassword = await hashGenerator.generate_sha_hash(password);
            console.log("hashed password: " + hashedPassword);
            const empCredQuery = `
                UPDATE empcred 
                SET password = ?
                WHERE employee_id = ?
            `;
            await connection.query(empCredQuery, [hashedPassword, employeeId]);
        }

        connection.release(); // Release the connection back to the pool

        if (empDataResult[0].affectedRows > 0) {
            res.status(200).json({ message: 'Employee updated successfully' });
        } else {
            res.status(404).json({ error: 'Employee does not exist' });
        }
    } catch (error) {
        console.error('Error updating employee data: ' + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = employeeAPIs;
