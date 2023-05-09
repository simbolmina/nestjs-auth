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

3. Create a `.env` file in the root folder of the project and add the necessary environment variables. Use the provided `.env.example` as a reference.

4. Create a new PostgreSQL database and configure the connection details in the `.env` file.

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

### Database Migration Functionality is In Work Progress

It will be set before production phase

## API Documentation

The API documentation is available through the Swagger UI, which can be accessed at [http://localhost:3000/api-doc?authToken=Docs-123456](http://localhost:3000/api-doc?authToken=Docs-123456). Replace `Docs-123456` with the actual password you set in the `SWAGGER_PASSWORD` or `Docs-123456` environment variable.
