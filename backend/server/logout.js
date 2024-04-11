const dbConnectionPool = require('./db.js');
const express = require('express');

const logoutAPI = express.Router();

logoutAPI.post('/clear-token/:employee_id', async (req, res) => {
    const employeeId = req.params.employee_id;

    try {
        // Get a connection from the connection pool
        const connection = await dbConnectionPool.getConnection();

        // SQL query to update token to NULL for the specified employee_id
        const query = 'UPDATE empcred SET token = NULL WHERE employee_id = ?';

        // Execute the query
        await connection.execute(query, [employeeId]);

        // Release the connection back to the pool
        connection.release();

        console.log('Token cleared for employee_id:', employeeId);
        res.status(200).json({ message: 'Token cleared successfully' });
    } catch (error) {
        console.error('Error clearing token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = logoutAPI;
