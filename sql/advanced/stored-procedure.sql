-- Cricket Player Performance & Selection Intelligence System
-- Advanced SQL Concept: Stored Procedure
-- Database: cricket_selection

USE cricket_selection;

DROP PROCEDURE IF EXISTS GetPlayerBattingStats;

DELIMITER $$

CREATE PROCEDURE GetPlayerBattingStats(
    IN p_player_name VARCHAR(100)
)
BEGIN
    SELECT
        p.player_id,
        p.player_name,
        p.country,
        COUNT(bp.batting_perf_id) AS innings_recorded,
        COALESCE(SUM(bp.runs_scored), 0) AS total_runs,
        COALESCE(SUM(bp.fours), 0) AS total_fours,
        COALESCE(SUM(bp.sixes), 0) AS total_sixes
    FROM player p
    LEFT JOIN batting_performance bp
        ON p.player_id = bp.player_id
    WHERE p.player_name LIKE CONCAT('%', p_player_name, '%')
    GROUP BY
        p.player_id,
        p.player_name,
        p.country
    ORDER BY total_runs DESC;
END$$

DELIMITER ;

-- Example execution:
-- CALL GetPlayerBattingStats('Virat Kohli');
