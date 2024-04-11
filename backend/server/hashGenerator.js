const crypto = require('crypto');

async function generate_sha_hash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = { generate_sha_hash };

    
