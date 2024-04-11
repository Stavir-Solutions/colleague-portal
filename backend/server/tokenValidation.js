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
        return res.status(401).send('Unauthorized - Token missing');
    }

    try {
        const tokenInfo = await validateToken(token);

        if (!tokenInfo) {
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
        //Check if the token belongs to the same user by querying employeecred table
        //If yes return true, else return false
    } catch (error) {
        console.error('Error validating token:', error);
        throw error;
    }
};
module.exports = { authenticateToken };
