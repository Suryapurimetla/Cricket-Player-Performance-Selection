# Cricket Player Performance & Selection Intelligence System

## 1. Project Overview

The **Cricket Player Performance & Selection Intelligence System** is a database-driven web application designed to analyze cricket player performance and support player selection decisions.

The project combines a relational database with a NoSQL database to manage cricket statistics, generate analytical reports, and maintain scouting reports.

## 2. Objectives

- Store and manage cricket players, teams, matches, innings, and performance statistics.
- Analyze batting and bowling performance using SQL queries.
- Rank players using performance-based analytics.
- Maintain scouting reports containing strengths, weaknesses, observations, and selection recommendations.
- Implement authentication and role-based access control.
- Demonstrate relational and NoSQL database concepts in a working web application.

## Team Members and Contributions

This project was developed collaboratively by two team members.

| Team Member | Responsibilities |
|---|---|
| **Jaya Surya** | Designed the MySQL relational database, developed the ER diagram and relational schema, implemented SQL queries and advanced database concepts, and worked on database constraints, stored procedures, triggers, and views. Contributed to application integration, testing, and documentation. |
| **Sreyaesh Peruri** | Contributed to MongoDB database design and scouting report management, implemented MongoDB operations and aggregation, and worked on the Next.js application interface, API integration, authentication, and role-based access control. Contributed to testing, screenshots, and documentation. |

Both team members contributed to the development and testing of the Cricket Player Performance & Selection Intelligence System, integrating MySQL and MongoDB into a single web application.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application and API routes |
| React | User interface |
| TypeScript | Application logic and type safety |
| MySQL | Relational data storage and SQL analytics |
| MongoDB | Scouting report document storage |
| Docker | MongoDB container environment |
| JWT | Session authentication |
| bcrypt | Password hashing |

## 4. Database Architecture

### MySQL — Relational Database

Database name: `cricket_selection`

MySQL stores structured cricket data and user information. The database contains 12 tables:

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

The relational schema uses primary keys, foreign keys, unique constraints, CHECK constraints, and indexes to support data integrity and efficient queries.

The database also contains:

- Two views: `vw_batting_performance` and `vw_player_details`
- Stored procedure: `GetPlayerBattingStats`
- Trigger: `trg_validate_batting_performance`
- Composite indexes for common player, innings, venue, format, and opponent queries

### MongoDB — NoSQL Database

Database name: `cricket_selection_nosql`

Collection: `scouting_reports`

MongoDB stores scouting reports in a flexible document structure. Reports can contain player information, strengths, weaknesses, selection recommendations, observations, creator information, and timestamps, depending on the document structure.

The application supports scouting report management and includes a MongoDB aggregation demonstration that groups reports by recommendation.

Player information is validated against MySQL before scouting reports are created or updated.

## 5. Key Features

- Player information and performance data
- Batting analytics and player rankings
- Advanced SQL reports
- Scouting report management
- Search and filtering of scouting reports
- Admin and analyst roles
- Authentication-protected API routes
- Database constraints and validation
- Integration between MySQL and MongoDB

## 6. Advanced Database Concepts

The project demonstrates the following database concepts:

1. **SQL views:** Reusable queries for player details and batting performance.
2. **Stored procedures:** `GetPlayerBattingStats` provides player batting statistics.
3. **Triggers:** Validates batting statistics before insertion.
4. **Indexes:** Supports efficient lookups and joins.
5. **Common Table Expressions (CTEs):** Organizes analytical queries.
6. **Window functions:** Uses functions such as `RANK()` for player ranking.
7. **Aggregate functions and subqueries:** Supports performance summaries and player analysis.
8. **MongoDB aggregation:** Summarizes scouting reports by recommendation.

## 7. Authentication and Data Integrity

The application supports two roles:

- **Admin:** Can access administrative user-management operations.
- **Analyst:** Can access permitted application features but cannot access admin-only operations.

Passwords are hashed using bcrypt, sessions use JWT, and protected API routes check authentication and authorization.

Database constraints and foreign keys help prevent invalid or inconsistent relational records. Application-level validation provides additional checks before data is stored.

## 8. Project Structure

The project includes the following key directories and files:

```text
cricket-selection-app/
├── app/
│   └── api/
├── docs/
│   ├── database-design.md
│   ├── data-dictionary.md
│   ├── database-technology.md
│   ├── ER_Diagram.md
│   └── screenshots/
├── lib/
├── scripts/
│   ├── create-users.ts
│   ├── test-mongodb.ts
│   └── mongodb-aggregation-demo.ts
├── sql/
│   └── sql-operations-demo.sql
├── ER_DIAGRAM1.png
├── package.json
└── README.md
```

This is a high-level project structure. Some directories contain additional files and subdirectories.

## 9. Setup and Execution

### Prerequisites

- Node.js and npm
- MySQL
- MongoDB, locally or through Docker
- The project's configured databases and required environment variables

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Suryapurimetla/Cricket-Player-Performance-Selection.git
cd cricket-selection-app
npm install
```

Configure `.env.local` with the database connection settings and authentication secret required by the application.

Use your own local credentials and never commit secrets to GitHub.

Ensure MySQL is running and the `cricket_selection` database is configured. Ensure MongoDB is running and accessible through the configured connection string.

Start the development server:

```bash
npm run dev
```

Open the application at:

http://localhost:3000

### Production Build

To check the production build, run:

```bash
npm run build
```

### MongoDB Aggregation Demo

Run the aggregation demonstration from the project root:

```bash
npx tsx scripts/mongodb-aggregation-demo.ts
```

This script summarizes scouting reports by recommendation. Ensure the MongoDB connection is configured before running it.

## 10. Documentation and Screenshots

The `docs/` directory contains the database design, data dictionary, database technology justification, ER diagram documentation, and screenshots.

The `sql/` directory contains SQL operation examples, including advanced database demonstrations. The `scripts/` directory contains database testing and demonstration scripts.

### Application and Database Screenshots

Screenshots documenting the application's functionality and database implementation are available in `docs/screenshots/`.

| Screenshot | Description |
|---|---|
| `01-main-dashboard.png` | Main dashboard and analytics overview |
| `02-players-page.png` | Player listing |
| `03-player-selection.png` | Player selection interface |
| `04-top-batters-report.png` | Top batters report |
| `05-advanced-sql-reports.png` | Advanced SQL reports |
| `06-scouting-reports.png` | Scouting reports listing |
| `07-create-scouting-report.png` | Creating a scouting report |
| `08a-edit-report.png` | Editing a scouting report |
| `08b-search-filter.png` | Searching and filtering reports |
| `09-mysql-tables.png` | MySQL database tables |
| `10_ER_DIAGRAM.png` | Entity-relationship diagram |
| `11-stored-procedure.png` | Stored procedure demonstration |
| `12a-sql-views.png` | SQL views demonstration |
| `12b-trigger-validation.png` | Trigger and validation demonstration |
| `13-mongodb-aggregation.png` | MongoDB aggregation results |
| `14a-login-page.png` | Login interface |
| `14b-role-access-tests.png` | Unauthenticated API access test |
| `14c-analyst-access-denied.png` | Analyst authorization test |
| `14d-admin-access-success.png` | Admin authorization test |
| `15a-build-success.png` | Production build verification |
| `15b-github-repository.png` | GitHub repository |
| `16-mongodb-scouting-reports.png` | MongoDB scouting report documents |

## 11. Conclusion

The Cricket Player Performance & Selection Intelligence System demonstrates the integration of relational and NoSQL databases in a cricket analytics application.

It combines structured cricket performance data, SQL-based analytics, scouting reports, authentication, and database integrity mechanisms to support player evaluation and selection.

## 12. Future Enhancements

Potential future enhancements include:

- More advanced player-selection metrics
- Additional performance visualizations
- Semantic search for scouting reports
- Expanded testing and reporting
