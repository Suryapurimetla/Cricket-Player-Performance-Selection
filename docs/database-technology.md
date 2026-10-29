# Database Technology Selection

## 1. Project Overview

The Cricket Player Performance & Selection Intelligence System uses MySQL and MongoDB to manage cricket data and scouting reports.

The application is developed using Next.js and TypeScript. Its API routes connect the application to both databases, combining structured relational data with flexible document-based scouting information.

The use of MySQL and MongoDB demonstrates two database paradigms within the same application.

## 2. MySQL — Relational Database

MySQL stores structured cricket data in the `cricket_selection` database.

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

### Why MySQL Is Used

- **Relational structure:** Cricket data contains relationships between players, teams, matches, innings, and performance records.
- **Primary keys:** Uniquely identify records in each table.
- **Foreign keys:** Maintain relationships between related records.
- **CHECK constraints:** Enforce configured value and range restrictions.
- **Unique constraints:** Prevent duplicate values and combinations where specified.
- **Indexes:** Support selected lookups and joins.
- **SQL analytics:** Support joins, aggregation, filtering, subqueries, and performance reporting.
- **Views and stored procedures:** Provide reusable database operations.
- **Triggers:** Validate configured batting statistics before insertion.

The MySQL schema includes two views, `vw_batting_performance` and `vw_player_details`, the `GetPlayerBattingStats` stored procedure, and the `trg_validate_batting_performance` trigger.

These features support structured data management and cricket performance analysis.

## 3. MongoDB — NoSQL Database

MongoDB stores scouting reports in the `scouting_reports` collection within the `cricket_selection_nosql` database.

Scouting documents can contain fields such as:

- Player ID and player name
- Strengths
- Weaknesses
- Selection recommendation
- Additional observations
- Creator and creation timestamp
- Update timestamp and updater, where available

The exact fields depend on the stored document structure.

### Why MongoDB Is Used

- **Document-oriented storage:** Scouting reports can be represented as documents rather than fixed relational rows.
- **Flexible structure:** Different reports can accommodate evolving scouting requirements.
- **CRUD operations:** Reports can be created, retrieved, updated, and deleted through the application API.
- **Aggregation:** MongoDB aggregation can summarize scouting reports, including grouping them by recommendation.
- **Complementary storage:** MongoDB manages scouting documents while MySQL maintains structured cricket records.

The application validates that a selected player exists in MySQL before saving or updating a scouting report in MongoDB.

## 4. Application Integration

The application uses Next.js API routes and TypeScript to interact with the databases.

- **MySQL:** Provides player information, match details, and relational cricket performance data.
- **MongoDB:** Stores and manages scouting reports.
- **Authentication and authorization:** Protect restricted API operations according to the user's role.
- **Environment variables:** Store database connection settings and authentication configuration outside the source code.

The application validates incoming data before performing database operations. Database constraints provide additional integrity protection for relational records.

## 5. Data Integrity and Security

The project applies multiple data integrity and security mechanisms.

- **Referential integrity:** MySQL foreign keys maintain configured relationships between tables.
- **Domain validation:** MySQL CHECK constraints restrict configured values and ranges.
- **Uniqueness:** Unique constraints prevent duplicate values or combinations where defined.
- **Insertion validation:** The batting performance trigger rejects negative runs, balls faced, fours, and sixes during INSERT operations.
- **Application validation:** API routes validate incoming data and check player existence before scouting-report writes.
- **Password protection:** The application stores password hashes rather than plaintext passwords.
- **Role-based access control:** Administrative operations are restricted to authorized users.
- **Credential protection:** Database credentials and authentication secrets should be stored in environment variables and must not be committed to GitHub.

These mechanisms provide complementary protection at the application and database levels.

## 6. Vector Search and Future Enhancements

Vector search is a separate capability from ordinary document storage and CRUD operations.

The current scouting-report implementation and MongoDB aggregation demonstration do not, by themselves, establish that semantic vector search has been implemented.

Potential future enhancements include:

- Semantic search across scouting observations
- Similarity-based retrieval of player scouting reports
- Vector embeddings for scouting text
- Evaluation of retrieval quality and relevance

Any vector-search feature should be implemented and tested separately before being described as a completed project capability.

## 7. Conclusion

MySQL and MongoDB serve complementary roles in the Cricket Player Performance & Selection Intelligence System.

MySQL manages structured cricket records, relational integrity, and SQL-based analytics. MongoDB manages flexible scouting documents and supports document operations and aggregation.

Together, these databases support the application's cricket analysis and scouting workflows while demonstrating the integration of relational and NoSQL database paradigms.
