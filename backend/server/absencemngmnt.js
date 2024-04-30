const express = require('./parent.js');
const absencemngmntAPIs = express.Router();
const db = require('./db.js');
const { authenticateToken } = require('./tokenValidation');

absencemngmntAPIs.use(authenticateToken);

// Function to calculate the last day of the financial year
function calculateLastDayOfFinancialYear(endYear) {
    return new Date(endYear, 2, 31); // Last day of March
}

async function getTheLeavesTakenHoursFromTimesheet(employeeId, startDate, endDate) {
    try {
        console.log(`Fetching leaves taken from timesheet for employee ${employeeId} between ${startDate} and ${endDate}`);
        const query = `
            SELECT SUM(leaves) AS totalLeaves
            FROM emptimesheet
            WHERE employee_id = ? AND date BETWEEN ? AND ?
        `;
        console.log(`Executing SQL query: ${query}`);
        const result = await db.query(query, [employeeId, startDate, endDate]);
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
function calculateProratedLeaves(employeeStartDateForTheYear, financialYearEndDate) {
    
    const endDate = new Date()<financialYearEndDate? new Date(): financialYearEndDate;
    const differenceInDays = Math.ceil((endDate - employeeStartDateForTheYear) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    console.log(`financialYearEndDate: ${financialYearEndDate}, endDate: ${endDate}, differenceInDays ${differenceInDays}`);
    const proratedLeaves =  Math.ceil(((12 / 365) * differenceInDays)*8);
    return proratedLeaves;
}

absencemngmntAPIs.get('/employees/:id/leaves/:endYear', async (req, res) => {
    const { id,  endYear } = req.params;

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

        // Calculate the start date of the financial year - April 1st of the previous year
        const  financialYearStartDate = new Date(endYear-1,3,1)
       

        // Function to calculate the start date of the year
        function calculateStartDate(joiningDate) {
            // Ensure joiningDate is a Date object
            //TODO not needed
            if (!(joiningDate instanceof Date)) {
                return null;
            }
            const joiningYear = joiningDate.getFullYear();
            console.log(`financialYearStartDate  ${financialYearStartDate}, joiningYear ${joiningYear}`);
            // Check if the joining date is before April 1st
            if (joiningYear < financialYearStartDate.getFullYear() || joiningDate.getMonth() < 2 || (joiningDate.getMonth() === 2 && joiningDate.getDate() < 1)) {
                return new Date(financialYearStartDate.getFullYear(), 3, 1); // Start date is April 1st of the current year
            } else {
                return joiningDate; // Start date is the joining date
            }
        }

        const startDateOfYear = calculateStartDate(joiningDate);
        if (!startDateOfYear) {
            console.log('Invalid joining date');
            res.status(404).send('Invalid joining date');
            return;
        }

        console.log(`Start date of the year for employee ${id} for year ${endYear}: ${startDateOfYear}`);

        const  financialYearEndDate = new Date(endYear,2,31)
        // Calculate last day of financial year
        console.log(`Last day of the financial year: ${financialYearEndDate.toISOString().slice(0, 10)}`);

        // Calculate number of expected working days
        const numberOfExpectedWorkingDays = Math.ceil((financialYearEndDate - startDateOfYear) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        // Calculate leaves eligible this year based on the formula
        const leavesHoursEligibleThisYear = Math.ceil((12*8 / 365) * numberOfExpectedWorkingDays);
        console.log(`Leaves eligible this year for employee ${id}: ${leavesHoursEligibleThisYear}`);

        // Calculate leaves taken from timesheet
        const leaveHoursTakenThisYear = await getTheLeavesTakenHoursFromTimesheet(id, startDateOfYear, financialYearEndDate);
        console.log(`Leaves taken hours this year for employee ${id}: ${leaveHoursTakenThisYear}`);

        // Calculate remaining leaves
        const remainingLeaveHours = leavesHoursEligibleThisYear - leaveHoursTakenThisYear;
        console.log(`Remaining leave hours this year for employee ${id}: ${remainingLeaveHours}`);

        // Calculate prorated leaves
        const proratedLeaves = calculateProratedLeaves(startDateOfYear, financialYearEndDate);
        console.log(`Prorated leaves for employee ${id}: ${proratedLeaves}`);

        // Determine if leaves taken this year exceed prorated leaves as of today
        const overUsedAsOfToday = leaveHoursTakenThisYear > proratedLeaves;

        // Send the response with start date of the year, last day of financial year, leaves eligible this year, leaves taken this year, remaining leaves, prorated leaves, and overUsedAsOfToday
        res.send(
            `Start date of the year for employee ${id} for year ${endYear} is: ${startDateOfYear.toISOString().slice(0, 10)}. 
            Last day of the financial year is: ${financialYearEndDate.toISOString().slice(0, 10)}. 
            Leaves eligible this year: ${leavesHoursEligibleThisYear}.
            Leaves taken this year: ${leaveHoursTakenThisYear}.
            Remaining leaves this year: ${remainingLeaveHours}.
            Prorated leaves: ${proratedLeaves}.
            Overused as of today: ${overUsedAsOfToday}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = absencemngmntAPIs;
