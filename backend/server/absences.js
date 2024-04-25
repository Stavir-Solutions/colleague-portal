const { v4: uuidv4 } = require('uuid');
const dbConnectionPool = require('./db.js');
const express = require('./parent.js')
const { authenticateToken } = require('./tokenValidation.js'); 
const absencesAPIs = express.Router();

// Apply the authentication middleware to all API routes
absencesAPIs.use(authenticateToken);


//Get the absences statistcs for a specific employee for a given financial year
//eg: api/v1/employees/ab1232-34fd/leaves/2025
absencesAPIs.get('/employees/:id/leaves/:yearEnd', async (req, res) => {
        //get employee from db by id
        const currentDate = new Date();
        const lastDayOfFinancialYear = getLastDayOfFinancialYear(2025);
        const employeeStartDateForTheYear = chooseEmployeeStartDateForTheYear();

        const leavesEligibleThisYear = calculateLeavesEligibleForDays(lastDayOfFinancialYear - employeeStartDateForTheYear);


        //const leavesTakenThisYear = getTheLeavesTakenFromTimesheet(id, employeeStartDateForTheYear, lastDayOfFinancialYear); //TODO
        const leavesTakenThisYear = getTheLeavesTakenFromTimesheet("b47d663d-f4ab-491c-a5cf-eda28e4ccbb8", "2024-04-01", "2025-03-31"); //TODO
        const remainingLeaves = leavesEligibleThisYear - leavesTakenThisYear
        const proratedLeavesAsOfToday = calculateLeavesEligibleForDays(currentDate - employeeStartDateForTheYear);
        const overUsedAsOfToday = leavesTakenThisYear>proratedLeavesAsOfToday; 
        res.status(200).json(  
            {"leavesEligibleThisYear" : leavesEligibleThisYear, "leavesTaken": leavesTakenThisYear,
             "remainingLeaves": remainingLeaves, "overUsed": overUsedAsOfToday} 
        );
});



async function getTheLeavesTakenFromTimesheet(employeeId, startDate, endDate) {
    try {
        const query = `
            SELECT SUM(leaves) AS totalLeaves
            FROM emptimesheet
            WHERE employee_id = ? AND date BETWEEN ? AND ?
        `;      
        const result = await dbConnectionPool.query(query, [employeeId, 2024, 2025]); 
        const totalLeavesTaken = result[0].totalLeaves || 0;
        
        return totalLeavesTaken;
    } catch (error) {
        
        console.error("Error fetching leaves taken from timesheet:", error);
        throw error; 
    }
}


async function calculateLeavesEligibleForDays(numberOfExpectedWorkingDays) {
    return (12*8/365) * numberOfExpectedWorkingDays;
}

async function getLastDayOfFinancialYear(yearEnd) {
    
    const lastDayOfMonth = 31;
    const month = 2; // March
    const year = yearEnd;

    const lastDayOfFinancialYear = new Date(year, month, lastDayOfMonth);
    
    return lastDayOfFinancialYear;
}



async function chooseEmployeeStartDateForTheYear(employeeId) {
    try {
        // Query the joining date of the employee
        const query = `
            SELECT joining_date
            FROM empdata
            WHERE employee_id = ?
        `;
        const result = await dbConnectionPool.query(query, [employeeId]);
        const joiningDate = result[0].joining_date;

        const currentYear = new Date().getFullYear();
        const aprilFirstCurrentYear = new Date(currentYear, 3, 1); 

        
        if (joiningDate < aprilFirstCurrentYear) {
            
            return aprilFirstCurrentYear;
        } else {
            
            return joiningDate;
        }
    } catch (error) {
        console.error("Error choosing employee start date for the year:", error);
        throw error;
    }
}

module.exports = absencesAPIs;
