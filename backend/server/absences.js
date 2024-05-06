const express = require('./parent.js');
const absencesAPIs = express.Router();
const db = require('./db.js');
const { authenticateToken } = require('./tokenValidation.js');

absencesAPIs.use(authenticateToken);

const MILLI_SECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MAX_LEAVES = 12;
const DAYS_IN_A_YEAR = 365;
const FULL_DAY_LEAVE_HOURS = 8;
const MARCH = 2;
const APRIL = 3;

async function getTheLeavesAndDatesFromTimesheet(employeeId, startDate, endDate) {
    try {
        // Fetch leaves and dates from the timesheet
        const query = `
            SELECT date, leaves
            FROM emptimesheet
            WHERE employee_id = ? AND date BETWEEN ? AND ? AND leaves != 0
        `;
        const result = await db.query(query, [employeeId, startDate, endDate]);

        // Extract dates and leaves
        const leavesAndDates = result[0].map(row => ({ date: row.date, leaves: row.leaves }));
        return leavesAndDates;
    } catch (error) {
        console.error("Error fetching leaves and dates from timesheet:", error);
        throw error;
    }
}

function calculateProratedLeaves(employeeStartDateForTheYear, financialYearEndDate) {
    const endDate = new Date() < financialYearEndDate ? new Date() : financialYearEndDate;
    
    const differenceInDays = Math.ceil((endDate - employeeStartDateForTheYear) / (MILLI_SECONDS_IN_A_DAY));
    const proratedLeaves = Math.ceil(((MAX_LEAVES / DAYS_IN_A_YEAR) * differenceInDays) * FULL_DAY_LEAVE_HOURS);
    return proratedLeaves;
}

async function getJoiningDate(employeeId) {
    const query = `
        SELECT joining_date
        FROM empdata
        WHERE employee_id = ?
    `;
    const result = await db.query(query, [employeeId]);
    return result[0][0]?.joining_date;
}


function calculateStartDate(joiningDate, financialYearStartDate) {
    if (!(joiningDate instanceof Date)) {
        return null;
    }
    const joiningYear = joiningDate.getFullYear();
    if (joiningYear < financialYearStartDate.getFullYear() || joiningDate.getMonth() < APRIL) {
        return new Date(financialYearStartDate.getFullYear(), APRIL, 1);
    } else {
        return joiningDate;
    }
}

absencesAPIs.get('/employees/:id/leaves/:endYear', async (req, res) => {
    const { id, endYear } = req.params;

    try {
        const joiningDate = await getJoiningDate(id);
        if (!joiningDate) {
            console.log(`Joining date not found for employee ${id}`);
            res.status(404).send('Joining date not found for employee');
            return;
        }

        const financialYearStartDate = new Date(endYear - 1, APRIL, 1);
        const startDateOfYear = calculateStartDate(new Date(joiningDate), financialYearStartDate);

        if (!startDateOfYear) {
            console.log('Invalid joining date');
            res.status(404).send('Invalid joining date');
            return;
        }

        
        const financialYearEndDate = new Date(endYear, MARCH, 31);
        
        // Retrieve leaves and dates from timesheet
        const leavesAndDates = await getTheLeavesAndDatesFromTimesheet(id, startDateOfYear, financialYearEndDate);
        
        // Calculate total leaves taken
        const totalLeavesTaken = leavesAndDates.reduce((total, entry) => total + entry.leaves, 0);
        
        // Log retrieved leaves and dates
        console.log(`Leaves and dates retrieved for employee ${id}:`, leavesAndDates);

        const numberOfExpectedWorkingDays 
            = Math.ceil((financialYearEndDate - startDateOfYear) / MILLI_SECONDS_IN_A_DAY);
        const leavesHoursEligibleThisYear 
            = Math.ceil((MAX_LEAVES * FULL_DAY_LEAVE_HOURS / DAYS_IN_A_YEAR) * numberOfExpectedWorkingDays);
        const remainingLeaveHours = leavesHoursEligibleThisYear - totalLeavesTaken;

        const proratedLeaves = calculateProratedLeaves(startDateOfYear, financialYearEndDate);
        const overUsedAsOfToday = totalLeavesTaken > proratedLeaves;

        res.send({
            start_date: startDateOfYear.toISOString().slice(0, 10),
            end_date: financialYearEndDate.toISOString().slice(0, 10),
            leaves_eligible_this_year: leavesHoursEligibleThisYear,
            leaves_taken_this_year: totalLeavesTaken,
            remaining_leaves_this_year: remainingLeaveHours,
            prorated_leaves: proratedLeaves,
            overused_as_of_today: overUsedAsOfToday,
            leaves_and_dates: leavesAndDates
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = absencesAPIs;
