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
