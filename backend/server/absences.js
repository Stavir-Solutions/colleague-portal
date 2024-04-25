const { v4: uuidv4 } = require('uuid');
const dbConnectionPool = require('./db.js');
const express = require('./parent.js')
const { authenticateToken, isSameUser } = require('./tokenValidation.js'); 
const absencesAPIs = express.Router();

// Apply the authentication middleware to all API routes
absencesAPIs.use(authenticateToken);


//Get the absences statistcs for a specific employee for a given financial year
//eg: api/v1/employees/ab1232-34fd/leaves/2025
absencesAPIs.get('/employees/:id/leaves/:yearEnd', async (req, res) => {
        //get employee from db by id
        const currentDate = new Date(); //TODO
        const lastDayOfFinancialYear = getLastDayOfFinancialYear(yearEnd);
        const employeeStartDateForTheYear = chooseEmployeeStartDateForTheYear();

        const leavesEligibleThisYear = calculateLeavesEligibleForDays(lastDayOfFinancialYear - employeeStartDateForTheYear);


        const leavesTakenThisYear = getTheLeavesTakenFromTimesheet(id, employeeStartDateForTheYear, lastDayOfFinancialYear); //TODO
        const remainingLeaves = leavesEligibleThisYear - leavesTakenThisYear
        const proratedLeavesAsOfToday = calculateLeavesEligibleForDays(currentDate - employeeStartDateForTheYear);
        const overUsedAsOfToday = leavesTakenThisYear>proratedLeavesAsOfToday; 
        res.status(200).json(  
            {"leavesEligibleThisYear" : leavesEligibleThisYear, "leavesTaken": leavesTaken,
             "remainingLeaves": remainingLeaves, "overUsed": overUsedAsOfToday} 
        );
});



async function getTheLeavesTakenFromTimesheet(numberOfExpectedWorkingDays) {
    //TODO 
    return 0;
}

async function calculateLeavesEligibleForDays(numberOfExpectedWorkingDays) {
    return (12/365) * numberOfExpectedWorkingDays;
}

async function getLastDayOfFinancialYear(yearEnd) {
    return new Date();
}


async function chooseEmployeeStartDateForTheYear(employeeId) {
    //TODO if employee joined this financial year (April 1st - March 31st) then joining date. else start of the financial year
    return new Date();
}

module.exports = absencesAPIs;
