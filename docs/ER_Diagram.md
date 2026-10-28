
erDiagram
    PLAYER ||--o{ PLAYER_ROLE : has
    PLAYER ||--o{ BATTING_PERFORMANCE : records
    PLAYER ||--o{ BOWLING_PERFORMANCE : records
    PLAYER ||--o{ OPPONENT : faces
    PLAYER ||--o{ DISMISSAL : bowls_or_fields

    TEAM ||--o{ MATCH : team1
    TEAM ||--o{ MATCH : team2
    TEAM o|--o{ MATCH : wins
    TEAM ||--o{ INNINGS : batting_team
    TEAM ||--o{ INNINGS : bowling_team
    TEAM ||--o{ OPPONENT : represents

    VENUE ||--o{ MATCH : hosts
    WEATHER o|--o{ MATCH : conditions

    MATCH ||--o{ INNINGS : contains
    MATCH ||--o{ OPPONENT : records

    INNINGS ||--o{ BATTING_PERFORMANCE : contains
    INNINGS ||--o{ BOWLING_PERFORMANCE : contains

    BATTING_PERFORMANCE o|--o{ DISMISSAL : has

    PLAYER {
        int player_id PK
        varchar player_name
        varchar country
        varchar batting_style
        varchar bowling_style
        date date_of_birth
    }

    PLAYER_ROLE {
        int role_id PK
        int player_id FK
        varchar format
        varchar role
    }

    TEAM {
        int team_id PK
        varchar team_name UK
    }

    MATCH {
        int match_id PK
        int team1_id FK
        int team2_id FK
        int venue_id FK
        int weather_id FK
        varchar match_format
        date match_date
        int winner_team_id FK
    }

    VENUE {
        int venue_id PK
        varchar venue_name
        varchar city
        varchar country
        int altitude_m
        varchar pitch_type
    }

    WEATHER {
        int weather_id PK
        varchar weather_condition
        decimal temperature_c
        decimal humidity_percent
        decimal wind_speed_kmh
        decimal rainfall_mm
    }

    INNINGS {
        int innings_id PK
        int match_id FK
        int innings_number
        int batting_team_id FK
        int bowling_team_id FK
        int total_runs
        int total_wickets
        decimal overs_played
    }

    BATTING_PERFORMANCE {
        int batting_perf_id PK
        int innings_id FK
        int player_id FK
        int runs_scored
        int balls_faced
        int fours
        int sixes
        decimal strike_rate
        int batting_position
        varchar phase
    }

    BOWLING_PERFORMANCE {
        int bowling_perf_id PK
        int innings_id FK
        int player_id FK
        decimal overs_bowled
        int runs_conceded
        int wickets_taken
        decimal economy_rate
        varchar phase
    }

    DISMISSAL {
        int dismissal_id PK
        int batting_perf_id FK
        varchar dismissal_type
        int bowler_id FK
        int fielder_id FK
    }

    OPPONENT {
        int opponent_id PK
        int player_id FK
        int team_id FK
        int match_id FK
    }

