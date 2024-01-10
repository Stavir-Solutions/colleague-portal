const express = require('./parent.js');
const { authenticateToken } = require('./tokenValidation');
const dbConnectionPool = require('./db.js');

const tmsummary = express.Router();

// Apply the authentication middleware to all API routes
tmsummary.use(authenticateToken);

// API to get total time worked and total leaves for a specific employee, year, and month
tmsummary.get('/summary', async (req, res) => {
  try {
    const { 'employee-id': employeeId, year, month } = req.query;

    // Validate input parameters
    if (!employeeId || !year || !month) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Check if the employee ID exists
    const checkEmployeeQuery = 'SELECT COUNT(*) as employeeCount FROM empdata WHERE employee_id = ?';
    const [employeeCheckResult] = await dbConnectionPool.query(checkEmployeeQuery, [employeeId]);

    const employeeCount = employeeCheckResult[0].employeeCount;

    if (employeeCount === 0) {
      return res.status(404).json({ error: 'Invalid employee ID' });
    }

    // Check if timesheet entries exist
    const checkEntryQuery = `
      SELECT COUNT(*) as entryCount
      FROM emptimesheet 
      WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
    `;

    const [entryCheckResult] = await dbConnectionPool.query(checkEntryQuery, [employeeId, year, month]);

    const entryCount = entryCheckResult[0].entryCount;

    if (entryCount === 0) {
      return res.status(404).json({ error: 'No timesheet entries found for the specified employee and month' });
    }

    // Get total time worked and total leaves
    const summaryQuery = `
      SELECT 
        SUM(working_hours) as total_time_worked, 
        SUM(leaves) as total_leaves 
      FROM emptimesheet 
      WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
    `;

    const [summaryResult] = await dbConnectionPool.query(summaryQuery, [employeeId, year, month]);

    const totalTimeWorked = summaryResult[0].total_time_worked;
    const totalLeaves = summaryResult[0].total_leaves;

    res.json({ total_time_worked: totalTimeWorked, total_leaves: totalLeaves });
  } catch (error) {
    console.error('Error fetching totals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = tmsummary;
