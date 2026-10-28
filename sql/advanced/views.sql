-- Cricket Player Performance & Selection Intelligence System
-- Advanced SQL Concept: Views
-- Database: cricket_selection

USE cricket_selection;

CREATE OR REPLACE VIEW vw_batting_performance AS
SELECT
    p.player_id,
    p.player_name,
    p.country,
    bp.innings_id,
    i.match_id,
    bp.runs_scored,
    bp.balls_faced,
    bp.fours,
    bp.sixes,
    bp.strike_rate,
    bp.batting_position,
    bp.phase
FROM player AS p
JOIN batting_performance AS bp
    ON p.player_id = bp.player_id
JOIN innings AS i
    ON bp.innings_id = i.innings_id;

-- Example query:
-- SELECT * FROM vw_batting_performance LIMIT 10;

-- View 2: Player details
CREATE OR REPLACE VIEW vw_player_details AS
SELECT
    player_id,
    player_name,
    country,
    batting_style,
    bowling_style,
    date_of_birth
FROM player;

-- Example query:
-- SELECT * FROM vw_player_details LIMIT 10;

