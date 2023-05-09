# Pazareo API

This is the backend API for the Pazareo project, built using NestJS, TypeORM, and PostgreSQL. The API also includes Swagger documentation for easy testing and exploration of the available endpoints.

## Getting Started

### Prerequisites

Before you begin, you will need to have the following installed on your machine:

1. [Node.js](https://nodejs.org/) (v14.x or higher)
2. [npm](https://www.npmjs.com/) (v6.x or higher)
3. [PostgreSQL](https://www.postgresql.org/download/) (v10.x or higher)
4. (Optional) [PgAdmin](https://www.pgadmin.org/download/) - a GUI tool for managing PostgreSQL databases

### Installation

1. Clone the repository:

```
git clone https://github.com/TheaTech-io/Web-Backend-NestJS-V3.git
```

2. Install the required packages:

```
cd pazareo
npm install
```

3. Create a new PostgreSQL database and configure the connection details in the `.env` file. Passwords are set as `admin` in this configuation, it is usually `postgres`

### Running the Application

1. To start the application in development mode, run:

```
npm run start:dev
```

The application will be running at `http://localhost:3000/api/v3`.

2. Access the Swagger UI at `http://localhost:3000/api-doc?authToken=Docs-123456`. Replace `Docs-123456` with the actual password you set in the `SWAGGER_PASSWORD` environment variable.

### Running Tests

1. To run unit tests, execute:

```
npm run test:watch
```

2. To run end-to-end tests, execute:

```
npm run test:e2e
```

### Database Migration Functionality

The migration feature is being added to facilitate changes in the production database during the later stages of development. To make use of migrations, set `synchronize: false` in the dataSource configuration and refer to the migration commands in `package.json`.

After making changes to the data structure, first run:

```
npm run migration:generate -- db-config/migrations/NewMigration
```

This command will detect changes in your database. To apply the changes, run:

```
npm run migration:run
```

To revert the changes, use the following command:

```
npm run migration:revert
```

For an example in action, check out this video: [https://www.youtube.com/watch?v=5G81_VIjaO8&t=96s](https://www.youtube.com/watch?v=5G81_VIjaO8&t=96s).

## API Documentation

API documentation is provided through the Swagger UI, which can be accessed at [http://localhost:3000/api-doc?authToken=Docs-123456](http://localhost:3000/api-doc?authToken=Docs-123456). For some examples, check out this video: [https://www.youtube.com/watch?v=lZmsY0e2ojQ](https://www.youtube.com/watch?v=lZmsY0e2ojQ).

### .env Configuration

NestJS has a unique .env system, and a robust environment variable system has not yet been implemented in this project. For now, please add the necessary variable names as hardcoded values.
