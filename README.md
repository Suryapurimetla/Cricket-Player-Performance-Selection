# Cricket Player Performance & Selection Intelligence System

## 1. Project Overview

The **Cricket Player Performance & Selection Intelligence System** is a database-driven web application designed to analyze cricket player performance and support player selection decisions.

The project combines a relational database with a NoSQL database to manage cricket statistics, generate analytical reports, and maintain scouting reports.

## 2. Objectives

- Store and manage cricket players, teams, matches, innings, and performance statistics.
- Analyze batting and bowling performance using SQL queries.
- Rank players using performance-based analytics.
- Maintain scouting reports with strengths, weaknesses, and selection recommendations.
- Implement authentication and role-based access control.
- Demonstrate relational and NoSQL database concepts in a working web application.

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

MySQL stores structured cricket data and user information.

The database includes tables for:

- Players and teams
- Matches and venues
- Innings
- Batting and bowling performance
- Dismissals
- Player roles
- Opponents
- Weather
- Users

The relational schema uses primary keys, foreign keys, unique constraints, check constraints, indexes, and database-level validation.

The project also includes SQL views, a stored procedure, a validation trigger, analytical queries, and player-ranking reports.

### MongoDB — NoSQL Database

MongoDB stores scouting reports in the `scouting_reports` collection.

Each report can contain the player ID, player name, strengths, weaknesses, selection recommendation, observations, creator, and timestamps.

The application supports creating, viewing, editing, deleting, and filtering scouting reports. Player information is validated against MySQL before scouting reports are created or updated.

A MongoDB aggregation pipeline groups scouting reports by recommendation and counts the reports in each group.

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

1. **SQL views** — reusable queries for player details and batting performance.
2. **Stored procedures** — `GetPlayerBattingStats` retrieves aggregated batting statistics for a player.
3. **Triggers** — validates batting statistics before insertion.
4. **Indexes** — supports efficient lookups and joins.
5. **Common Table Expressions (CTEs)** — organizes analytical queries.
6. **Window functions** — ranks players using the `RANK()` function.
7. **Aggregate functions and subqueries** — supports performance summaries and player analysis.
8. **MongoDB aggregation** — summarizes scouting reports by recommendation.

## 7. Authentication and Data Integrity

The application supports two roles:

- **Admin:** can access administrative user-management operations.
- **Analyst:** can use permitted application features but cannot access admin-only operations.

Passwords are hashed using bcrypt, sessions are protected using JWT, and protected API routes check authentication and authorization.

Database-level constraints and foreign keys help prevent invalid or inconsistent cricket performance records.

## 8. Project Structure

```text
cricket-selection-app/
├── app/
│   ├── api/
│   └── ...
├── docs/
│   ├── database-design.md
│   ├── data-dictionary.md
│   ├── database-technology.md
│   └── ER_Diagram.md
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

## 9. Setup and Execution

### Prerequisites

- Node.js and npm
- MySQL
- MongoDB, locally or through Docker
- The project's configured databases and required environment variables

### Installation

Clone the repository and navigate to the project directory.

```bash
git clone <your-repository-url>
cd cricket-selection-app
npm install
```

Configure `.env.local` with the required database connection settings and authentication secret. Use your own local credentials and never commit secrets to GitHub.

Ensure MySQL is running and the `cricket_selection` database is configured. Ensure MongoDB is running and accessible through the configured connection string.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### MongoDB Aggregation Demo

Run the read-only aggregation demonstration from the project root:

```bash
npx tsx scripts/mongodb-aggregation-demo.ts
```

This script summarizes scouting reports by recommendation.

## 10. Documentation and Screenshots

The `docs/` directory contains the database design, data dictionary, database technology justification, and ER diagram documentation.

The `sql/` directory contains SQL operation examples, including advanced database demonstrations. The `scripts/` directory contains database testing and demonstration scripts.

### Application and Database Screenshots

Screenshots documenting the application's functionality and database implementation are available in [`docs/screenshots/`](docs/screenshots/).

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

The Cricket Player Performance & Selection Intelligence System demonstrates the integration of relational and NoSQL databases in a cricket analytics application. It combines structured performance data, SQL-based analytics, scouting reports, authentication, and database integrity mechanisms to support informed player evaluation and selection.

## 12. Future Enhancements

- More advanced player-selection metrics
- Additional performance visualizations
- Semantic search for scouting reports
- Expanded testing and reporting
