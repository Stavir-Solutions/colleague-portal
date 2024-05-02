const express = require('./parent.js');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const employeeRoutes = require('./employee.js');
const timesheetRoutes = require('./timesheet.js');
const loginRoutes = require('./login.js');
const tmsummaryRoutes = require('./tmsummary');
const logoutRoutes = require('./logout');

const absencemngmntRoute = require('./absencemngmnt');

app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/timesheet', timesheetRoutes);
app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/tmsummary', tmsummaryRoutes);
app.use('/api/v1/logout', logoutRoutes);

app.use('/api/v1/absencemngmnt', absencemngmntRoute);

const port = 3000;
app.listen(port, () => console.log(`Server listening at the port ${port}`));
