const { v4: uuidv4 } = require('uuid');
const express = require('./parent.js');
const dbConnectionPool = require('./db.js');
const loginAPIs = express.Router();
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/app.properties');
const hashGenerator = require('./hashGenerator.js');

async function updateTokenInDatabase(username, newToken) {
  try {
    const connection = await dbConnectionPool.getConnection();
    const validityDuration = properties.get("token.validity.hours");
    const updateQuery = {
      text: 'UPDATE empcred SET token = ?, expiryTime = NOW() + INTERVAL ' + validityDuration + ' HOUR WHERE username = ?',
      values: [newToken, username],
    };
    const [updateResults] = await connection.execute(updateQuery.text, updateQuery.values);
    connection.release();
    return updateResults.affectedRows > 0;
  } catch (error) {
    console.error('Error updating token in the database:', error);
    return false;
  }
}

async function hasReportees(employeeId) {
  try {
    const connection = await dbConnectionPool.getConnection();
    const countQuery = {
      text: 'SELECT COUNT(*) AS reporteeCount FROM empdata WHERE reporting_manager_id = ?',
      values: [employeeId],
    };
    const [countResults] = await connection.execute(countQuery.text, countQuery.values);
    connection.release();
    const hasReportees = countResults[0].reporteeCount > 0;
    return hasReportees;
  } catch (error) {
    console.error('Error checking reportees:', error);
    return false;
  }
}

loginAPIs.post('/', async (req, res) => {
  console.info('Login attempt');
  try {
    const { username, password } = req.body;
    const connection = await dbConnectionPool.getConnection();

    const query = {
      text: 'SELECT e.*, ed.employee_name FROM empcred e JOIN empdata ed ON e.employee_id = ed.employee_id WHERE e.username = ?',
      values: [username],
    };
    const [results] = await connection.execute(query.text, query.values);

    if (results.length === 0) {
      console.warn('Username or password is incorrect.');
      return res.status(404).json({ error: 'Username not found' });
    }

    const user = results[0];
    const hashedPassword = await hashGenerator.generate_sha_hash(password);

    if (user.password !== hashedPassword) {
      console.warn('Username or password is incorrect .');
      return res.status(401).json({ error: 'Invalid password' });
    }

    const newToken = uuidv4();
    const updateSuccess = await updateTokenInDatabase(username, newToken);
    const hasReporteesValue = await hasReportees(user.employee_id);

    if (updateSuccess) {
      return res.status(200).json({
        token: newToken,
        employee_id: user.employee_id,
        employee_name: user.employee_name, 
        hasReportees: hasReporteesValue,
      });
    } else {
      console.error('Internal server error');
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

loginAPIs.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }
  next();
});

module.exports = loginAPIs;
