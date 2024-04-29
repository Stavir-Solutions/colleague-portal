const express = require('./parent.js');
const absencemngmntAPIs = express.Router();
const db = require('./db.js');
const { authenticateToken } = require('./tokenValidation');

absencemngmntAPIs.use(authenticateToken);

// Function to calculate the last day of the financial year
function calculateLastDayOfFinancialYear() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // March is month index 2 (0-indexed)
    return new Date(nextYear, 2, 31); // Last day of March
}

async function getTheLeavesTakenFromTimesheet(employeeId, startDate, endDate) {
    try {
        console.log(`Fetching leaves taken from timesheet for employee ${employeeId} between ${startDate} and ${endDate}`);
        const query = `
            SELECT SUM(leaves) AS totalLeaves
            FROM emptimesheet
            WHERE employee_id = ? AND date BETWEEN ? AND ?
        `;
        console.log(`Executing SQL query: ${query}`);
        const result = await db.query(query, [employeeId, startDate.getFullYear(), endDate.getFullYear()]);
        console.log(`Result from database:`, result);

        const totalLeavesTaken = result[0][0].totalLeaves || 0;
        console.log(`Total leaves taken this year for employee ${employeeId}: ${totalLeavesTaken}`);

        return totalLeavesTaken;
    } catch (error) {
        console.error("Error fetching leaves taken from timesheet:", error);
        throw error;
    }
}

// Function to calculate prorated leaves
function calculateProratedLeaves(employeeStartDateForTheYear) {
    const currentDate = new Date();
    const differenceInDays = Math.ceil((currentDate - employeeStartDateForTheYear) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    const proratedLeaves = (12 / 365) * differenceInDays;
    return proratedLeaves;
}

absencemngmntAPIs.get('/employees/:id/leaves/:yearEnd', async (req, res) => {
    const { id, yearEnd } = req.params;

    try {
        console.log(`Fetching joining date for employee ${id}`);
        // Fetch joining date from the database
        const query = `
            SELECT joining_date
            FROM empdata
            WHERE employee_id = ?
        `;
        console.log(`Executing SQL query: ${query}`);
        const result = await db.query(query, [id]);
        console.log(`Result from database:`, result);

        // Check if the result array contains any rows
        if (result.length === 0 || result[0].length === 0 || !result[0][0].joining_date) {
            console.log(`Joining date not found for employee ${id}`);
            res.status(404).send('Joining date not found for employee');
            return;
        }
        const joiningDate = new Date(result[0][0].joining_date);
        console.log(`Joining date for employee ${id}: ${joiningDate}`);

        // Function to calculate the start date of the year
        function calculateStartDate(joiningDate) {
            // Ensure joiningDate is a Date object
            if (!(joiningDate instanceof Date)) {
                return null;
            }
            const currentYear = new Date().getFullYear();
            const joiningYear = joiningDate.getFullYear();
            // Check if the joining date is before April 1st
            if (joiningDate.getMonth() < 2 || (joiningDate.getMonth() === 2 && joiningDate.getDate() < 1)) {
                return new Date(currentYear, 3, 1); // Start date is April 1st of the current year
            } else {
                return new Date(joiningYear, joiningDate.getMonth(), joiningDate.getDate()); // Start date is the joining date
            }
        }

        const startDateOfYear = calculateStartDate(joiningDate);
        if (!startDateOfYear) {
            console.log('Invalid joining date');
            res.status(404).send('Invalid joining date');
            return;
        }

        console.log(`Start date of the year for employee ${id} for year ${yearEnd}: ${startDateOfYear}`);

        // Calculate last day of financial year
        const lastDayOfFinancialYear = calculateLastDayOfFinancialYear();
        console.log(`Last day of the financial year: ${lastDayOfFinancialYear.toISOString().slice(0, 10)}`);

        // Calculate number of expected working days
        const numberOfExpectedWorkingDays = Math.ceil((lastDayOfFinancialYear - startDateOfYear) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        // Calculate leaves eligible this year based on the formula
        const leavesEligibleThisYear = (12 / 365) * numberOfExpectedWorkingDays;
        console.log(`Leaves eligible this year for employee ${id}: ${leavesEligibleThisYear}`);

        // Calculate leaves taken from timesheet
        const leavesTakenThisYear = await getTheLeavesTakenFromTimesheet(id, startDateOfYear, lastDayOfFinancialYear);
        console.log(`Leaves taken this year for employee ${id}: ${leavesTakenThisYear}`);

        // Calculate remaining leaves
        const remainingLeaves = leavesEligibleThisYear - leavesTakenThisYear;
        console.log(`Remaining leaves this year for employee ${id}: ${remainingLeaves}`);

        // Calculate prorated leaves
        const proratedLeaves = calculateProratedLeaves(startDateOfYear);
        console.log(`Prorated leaves for employee ${id}: ${proratedLeaves}`);

        // Determine if leaves taken this year exceed prorated leaves as of today
        const overUsedAsOfToday = leavesTakenThisYear > proratedLeaves;

        // Send the response with start date of the year, last day of financial year, leaves eligible this year, leaves taken this year, remaining leaves, prorated leaves, and overUsedAsOfToday
        res.send(
            `Start date of the year for employee ${id} for year ${yearEnd} is: ${startDateOfYear.toISOString().slice(0, 10)}. 
            Last day of the financial year is: ${lastDayOfFinancialYear.toISOString().slice(0, 10)}. 
            Leaves eligible this year: ${leavesEligibleThisYear}.
            Leaves taken this year: ${leavesTakenThisYear}.
            Remaining leaves this year: ${remainingLeaves}.
            Prorated leaves: ${proratedLeaves}.
            Overused as of today: ${overUsedAsOfToday}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = absencemngmntAPIs;
