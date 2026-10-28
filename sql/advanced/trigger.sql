-- Cricket Player Performance & Selection Intelligence System
-- Advanced SQL Concept: BEFORE INSERT Trigger
-- Database: cricket_selection

USE cricket_selection;

DROP TRIGGER IF EXISTS trg_validate_batting_performance;

DELIMITER $$

CREATE TRIGGER trg_validate_batting_performance
BEFORE INSERT ON batting_performance
FOR EACH ROW
BEGIN
    IF NEW.runs_scored < 0
       OR NEW.balls_faced < 0
       OR NEW.fours < 0
       OR NEW.sixes < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Batting statistics cannot be negative';
    END IF;
END$$

DELIMITER ;
