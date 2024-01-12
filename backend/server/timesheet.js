const { v4: uuidv4 } = require('uuid');
var dbConnectionPool = require('./db.js');
const express = require('./parent.js')
const { authenticateToken } = require('./tokenValidation'); 
var timesheetAPIs = express.Router();

// Apply the authentication middleware to all API routes
timesheetAPIs.use(authenticateToken);

// Timesheet APIS
// Create a POST route for adding timesheet data
timesheetAPIs.post('/', async (req, res) => {
    const { employee_id, date, working_hours, leaves, holiday } = req.body;

    if (!employee_id || !date || working_hours === undefined || leaves === undefined || holiday === undefined) {
        res.status(400).json({ error: "Invalid request payload" });
        return;
    }

    // Generate UUID and convert to string
    const timesheet_id = uuidv4();

    const insertOrUpdateQuery = `
    INSERT INTO emptimesheet (timesheet_id, employee_id, date, working_hours, leaves, holiday)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    employee_id = VALUES(employee_id),
    date = VALUES(date),
    working_hours = VALUES(working_hours),
    leaves = VALUES(leaves),
    holiday = VALUES(holiday)
`;

try {
    const connection = await dbConnectionPool.getConnection();
    const [results] = await connection.execute(insertOrUpdateQuery, [timesheet_id, employee_id, date, working_hours, leaves, holiday]);

    if (results.affectedRows > 0) {
        res.status(201).json({ message: "Timesheet added" });
    } else {
        res.status(500).json({ error: "Failed to add or update timesheet" });
    }

    connection.release(); // Release the connection back to the pool
} catch (err) {
    console.error("Database error: " + err.message);
    res.status(500).json({ error: "Database error: " + err.message });
}
});


//FETCH TIMESHEET BASED ON EMPLOYEE ID
// Function to validate the yearAndMonth parameter
function isValidYearAndMonth(yearAndMonth) {
    const regex = /^\d{4}-\d{2}$/;
    return regex.test(yearAndMonth);
}

timesheetAPIs.get('/employees/:employeeId/month/:yearAndMonth', async (req, res) => {
    const employeeId = req.params.employeeId;
    const yearAndMonth = req.params.yearAndMonth;

    // Check for an invalid month in the request parameters
    if (!isValidYearAndMonth(yearAndMonth)) {
        res.status(400).json({ error: 'Invalid month ' });
        return;
    }

    // Extract year and month from the parameter
    const [year, month] = yearAndMonth.split('-');

    try {
        const connection = await dbConnectionPool.getConnection();

        // Query the database to fetch timesheet data
        const query = `
            SELECT * FROM emptimesheet
            WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
        `;

        const [results] = await connection.execute(query, [employeeId, year, month]);

        if (results.length === 0) {
            res.status(404).json({ error: 'No timesheet entries for the specified month' });
        } else {
            res.json(results);
        }

        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error fetching timesheet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//FETCH TIMESHEET BASED ON REPORTING MANAGER ID
timesheetAPIs.get('/employees/:reporting_manager_id/subordinates/month/:yearAndMonth', async (req, res) => {
    const { reporting_manager_id, yearAndMonth } = req.params;
    let connection;

    try {
        connection = await dbConnectionPool.getConnection();

        const managerResult = await connection.execute('SELECT * FROM empdata WHERE BINARY employee_id = ?', [reporting_manager_id]);

        if (managerResult.length === 0) {
            res.status(404).json({ error: 'Employee does not exist' });
            return;
        }

        if (!isValidYearAndMonth(yearAndMonth)) {
            res.status(400).json({ error: 'Invalid year and month format' });
            return;
        }

        const [year, month] = yearAndMonth.split('-');

        const fetchTimesheetQuery = `
            SELECT t.timesheet_id, t.date, t.working_hours, t.leaves, t.holiday, t.employee_id, e.employee_name
            FROM emptimesheet t
            JOIN empdata e ON t.employee_id = e.employee_id
            WHERE YEAR(t.date) = ? AND MONTH(t.date) = ?
            AND e.reporting_manager_id = ?
            ORDER BY t.employee_id, t.date;
        `;

        const [timesheetResult] = await connection.execute(fetchTimesheetQuery, [year, month, reporting_manager_id]);

        if (timesheetResult.length === 0) {
            res.status(404).json({ error: 'No timesheet entries found for the specified month' });
        } else {
            res.json(timesheetResult);
        }
    } catch (error) {
        console.error('Error in timesheet API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});



module.exports=timesheetAPIs;


