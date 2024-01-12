-- emptime.emptimesheet definition

CREATE TABLE `emptimesheet` (
  `timesheet_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` date NOT NULL,
  `working_hours` float NOT NULL,
  `leaves` float DEFAULT NULL,
  `holiday` float DEFAULT NULL,
  `employee_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `employee_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`timesheet_id`),
  KEY `emptimesheet_FK` (`employee_id`),
  KEY `employee_name` (`employee_name`),
  CONSTRAINT `emptimesheet_FK` FOREIGN KEY (`employee_id`) REFERENCES `empdata` (`employee_id`),
  CONSTRAINT `emptimesheet_FKb` FOREIGN KEY (`employee_name`) REFERENCES `empdata` (`employee_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;