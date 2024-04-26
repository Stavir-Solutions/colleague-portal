const { v4: uuidv4 } = require('uuid');
const dbConnectionPool = require('./db.js');
const express = require('./parent.js')
const { authenticateToken } = require('./tokenValidation.js'); 
const absencesAPIs = express.Router();

// Apply the authentication middleware to all API routes
absencesAPIs.use(authenticateToken);


//Get the absences statistcs for a specific employee for a given financial year
//eg: api/v1/employees/ab1232-34fd/leaves/2025
absencesAPIs.get('/employees/:id/leaves/:endYear', async (req, res) => {
        const employeeId = req.params.id;
        const endYear = req.params.endYear;
        //get employee from db by id
        const currentDate = new Date();
        const lastDayOfFinancialYear = getLastDayOfFinancialYear(2025);
        const employeeStartDateForTheYear = chooseEmployeeStartDateForTheYear();

        const leavesEligibleThisYear = calculateLeavesEligibleForDays(lastDayOfFinancialYear - employeeStartDateForTheYear);


        //const leavesTakenThisYear = getTheLeavesTakenFromTimesheet(id, employeeStartDateForTheYear, lastDayOfFinancialYear); //TODO
        const leavesTakenThisYear = await getTheLeavesTakenFromTimesheet(employeeId, '2024-04-01 00:00:00', '2025-03-31 11:59:59'); //TODO
        
        const remainingLeaves = leavesEligibleThisYear - leavesTakenThisYear
        const proratedLeavesAsOfToday = calculateLeavesEligibleForDays(currentDate - employeeStartDateForTheYear);
        const overUsedAsOfToday = leavesTakenThisYear>proratedLeavesAsOfToday; 
        res.status(200).json(  
            {"leavesEligibleThisYear" : leavesEligibleThisYear, "leavesTaken": leavesTakenThisYear,
             "remainingLeaves": remainingLeaves, "overUsed": overUsedAsOfToday} 
        );
});



async function getTheLeavesTakenFromTimesheet(employeeId, startDate, endDate) {
    console.log("get absences of employee " + employeeId + " from " + startDate + " to " + endDate);
    try {
        const query = `
            SELECT SUM(leaves) AS totalLeaves
            FROM emptimesheet
            WHERE employee_id = ? AND date BETWEEN ? AND ?
        `;      
        const result = await dbConnectionPool.query(query, [employeeId, startDate, endDate]); 
        const totalLeavesTaken = result[0][0].totalLeaves || 0;
        console.log("leavesTakenThisYear" + totalLeavesTaken);
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



async function chooseEmployeeStartDateForTheYear(employeeId, endYear) {
    var employeeStartDateForTheYear = new Date();
    try {
        // Query the joining date of the employee
        const query = `
            SELECT DATE_FORMAT(e.joining_date,\'%m-%d-%Y\') AS joining_date
            FROM empdata e
            WHERE e.employee_id = ?
        `;
        const result = await dbConnectionPool.query(query, [employeeId]);
        console.log("result" + JSON.stringify(result));
        console.log("result" + result);
        console.log("result0" + JSON.stringify(result[0]));
        console.log("result0" + result[0]);
        console.log("result1" + JSON.stringify(result[1]));
        console.log("result1" + result[1]);

        const joiningDate = result[1].joining_date;
        console.log("joiningDate" + joiningDate);

        const currentYear = new Date().getFullYear();
        console.log("currentYear" + currentYear);
        const aprilFirstOfTheYear = new Date(endYear, 3, 1); 
        console.log("aprilFirstOfTheYear" + aprilFirstOfTheYear);

        
        if (joiningDate < aprilFirstOfTheYear) {
            employeeStartDateForTheYear = aprilFirstOfTheYear;
        } else {
            employeeStartDateForTheYear = joiningDate;
        }
        console.log("employeeStartDateForTheYear" + employeeStartDateForTheYear);
        return employeeStartDateForTheYear;

    } catch (error) {
        console.error("Error choosing employee start date for the year:", error);
        throw error;
    }
}

module.exports = absencesAPIs;
