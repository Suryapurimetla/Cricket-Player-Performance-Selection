# Database Technology Selection

## 1. Project Overview

The Cricket Player Performance & Selection Intelligence System uses MySQL and MongoDB to manage cricket data and scouting reports. The Next.js application provides the interface and API routes that connect to these databases.

## 2. MySQL

MySQL stores structured, relational cricket data in the `cricket_selection` database.

The database contains 12 tables:

- `player`
- `team`
- `match`
- `venue`
- `weather`
- `innings`
- `player_role`
- `batting_performance`
- `bowling_performance`
- `dismissal`
- `opponent`
- `users`

### Why MySQL is used

- Primary keys uniquely identify records.
- Foreign keys maintain relationships between related tables.
- Check constraints validate configured values and ranges.
- Unique constraints prevent duplicate records.
- Indexes support efficient lookups.
- SQL supports joins, aggregation, filtering, and reporting across cricket data.

## 3. MongoDB

MongoDB stores scouting reports in the `scouting_reports` collection.

The reports contain fields such as:

- Player ID and player name
- Strengths
- Weaknesses
- Selection recommendation
- Additional observations
- Creator and creation timestamp
- Update timestamp and updater, where available

### Why MongoDB is used

- Scouting reports are naturally represented as documents.
- Document fields can support evolving scouting requirements.
- Reports can be created, retrieved, updated, and deleted through the application API.
- MongoDB complements the structured relational data stored in MySQL.

The application validates that the selected player exists in MySQL before saving or updating a scouting report in MongoDB.

## 4. Application Integration

The application uses Next.js API routes to interact with both databases.

- MySQL provides player information and relational cricket data.
- MongoDB stores scouting reports.
- Authentication protects the scouting-report API routes.
- The application uses environment variables for database configuration.

## 5. Data Integrity and Security

- MySQL foreign keys and constraints enforce configured relational rules.
- The application validates scouting-report fields before database operations.
- The users table stores password hashes rather than plaintext passwords.
- Database credentials should remain in environment variables and must not be committed to GitHub.

## 6. Vector Search

Vector search is a separate capability from ordinary document storage. The current scouting-report CRUD functionality does not, by itself, demonstrate semantic vector search.

If vector search is required for the project, the implementation and evaluation should be documented separately after confirming the applicable project requirements.
