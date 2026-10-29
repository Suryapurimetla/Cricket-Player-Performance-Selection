-- Cricket Player Performance & Selection Intelligence System
-- SQL Operations Demonstration
-- Note: The temporary sql_operations_demo table has already
-- been created, altered, and dropped during the live demonstration.
-- These statements are examples for documentation and review.

-- 1. CREATE TABLE
CREATE TABLE sql_operations_demo (
    demo_id INT PRIMARY KEY,
    demo_name VARCHAR(50) NOT NULL,
    score INT DEFAULT 0
);

-- 2. INSERT
INSERT INTO sql_operations_demo (demo_id, demo_name, score)
VALUES
    (1, 'Player A', 75),
    (2, 'Player B', 60);

-- 3. SELECT
SELECT * FROM sql_operations_demo;

-- 4. UPDATE
UPDATE sql_operations_demo
SET score = 90
WHERE demo_id = 1;

-- 5. DELETE
DELETE FROM sql_operations_demo
WHERE demo_id = 2;

-- 6. ALTER TABLE
ALTER TABLE sql_operations_demo
ADD COLUMN remarks VARCHAR(100) DEFAULT 'Not evaluated';

-- 7. DROP TABLE
DROP TABLE sql_operations_demo;

-- Example subquery against the actual cricket database:
SELECT player_id, player_name, country
FROM player
WHERE player_id IN (
    SELECT player_id
    FROM batting_performance
    GROUP BY player_id
    HAVING SUM(runs_scored) > 5000
)
ORDER BY player_name;

-- Additional analytical queries using actual cricket tables

-- 8. JOIN: Display player batting performances with innings details
SELECT
    p.player_name,
    i.match_id,
    i.innings_number,
    bp.runs_scored,
    bp.balls_faced
FROM player AS p
JOIN batting_performance AS bp
    ON p.player_id = bp.player_id
JOIN innings AS i
    ON bp.innings_id = i.innings_id
ORDER BY bp.runs_scored DESC
LIMIT 10;

-- 9. Aggregate: Summarize runs by player
SELECT
    p.player_id,
    p.player_name,
    COUNT(*) AS innings_recorded,
    SUM(bp.runs_scored) AS total_runs,
    AVG(bp.runs_scored) AS average_runs,
    MAX(bp.runs_scored) AS highest_recorded_score
FROM player AS p
JOIN batting_performance AS bp
    ON p.player_id = bp.player_id
GROUP BY p.player_id, p.player_name
HAVING SUM(bp.runs_scored) > 5000
ORDER BY total_runs DESC;