const dbConnectionPool = require('./db.js');

const validateToken = async (token) => {
    console.log('Validating token:', token);
    try {
        const connection = await dbConnectionPool.getConnection();
        const query = 'SELECT token, expiryTime FROM empcred WHERE token = ?';
        const [results] = await connection.execute(query, [token]);
        connection.release();

        if (results.length === 0) {
            console.log('Token not found:');
            return null; // Token not found
        }

        const { expiryTime } = results[0];

        if (new Date(expiryTime) < new Date()) {
            console.log('Token expired');
            return null; // Token expired
        }

        console.log('Token validated successfully');
        return results[0]; // Valid token
    } catch (error) {
        console.error('Error validating token:', error);
        throw error;
    }
};

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        console.warn('Authorization Header Missing')
        return res.status(401).send('Authorization Header Missing');
    }

    try {
        console.info('Validating token')
        const tokenInfo = await validateToken(token);

        if (!tokenInfo) {
            console.warn('Invalid Token')
            return res.status(401).send('Unauthorized - Invalid token');
        }

        // Attach token information to the request for later use if needed
        req.tokenInfo = tokenInfo;

        // Token is valid, continue with the API operation
        next();
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const isSameUser = async (employee_id, token) => {
    try {
        console.log('Checking if same user:', employee_id, token);
        const connection = await dbConnectionPool.getConnection();
        const query = 'SELECT employee_id FROM empcred WHERE token = ?';
        const [results] = await connection.execute(query, [token]);
        connection.release();

        if (results.length === 0) {
            // Token not found in the empcred table
            console.log('Token not found in database');
            return false;
        }

        const tokenEmployeeId = results[0].employee_id;

        // Compare the token's employee_id with the provided employee_id
        const sameUser = tokenEmployeeId === employee_id;

        console.log('Same user:', sameUser);
        return sameUser;

    } catch (error) {
        console.error('Error checking if same user:', error);
        throw error;
    }
};

module.exports = { authenticateToken, isSameUser };
