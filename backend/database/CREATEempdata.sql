-- emptime.empdata definition

CREATE TABLE `empdata` (
  `employee_id` varchar(255) NOT NULL,
  `employee_name` varchar(255)  NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `phone_number` varchar(10)  NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `leaving_date` date DEFAULT NULL,
  `reporting_manager_id` varchar(255) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `idx_employee_name` (`employee_name`)
) ENGINE=InnoDB ;