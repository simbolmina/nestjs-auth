# NestJS Authentication and User Management API

This project is a showcase of a backend API developed using NestJS, demonstrating capabilities in user management, authentication, and both unit and end-to-end testing. It utilizes TypeORM with PostgreSQL for database interactions and includes comprehensive API documentation using Swagger.

Codes are stripped out from a bigger app so there are some unnecessary codes in app here and there.

## Getting Started

### Prerequisites

Before you begin, you will need to have the following installed on your machine:

1. [Node.js](https://nodejs.org/) (v18.x or higher)
2. [npm](https://www.npmjs.com/) (v6.x or higher)
3. [PostgreSQL](https://www.postgresql.org/download/) (v10.x or higher)
4. [PgAdmin](https://www.pgadmin.org/download/) - a GUI tool for managing PostgreSQL databases
5. Create two databases with PgAdmin as `development` and `test`

### Installation

1. Clone the repository:

```
git clone https://github.com/simbolmina/nestjs-auth.git
```

2. Install the required packages:

```
cd nestjs-auth
npm install
```

3. Create a new PostgreSQL database and configure the connection details in the `.env` file. Passwords are set as `admin` in this configuation, it is usually `postgres`

### Running the Application

1. To start the application in development mode, run:

```
npm run start:dev
```

The application will be running at `http://localhost:5000/api/v1`.

2. Access the Swagger UI at `http://localhost:5000/api-doc

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

## Features and Modules

The API includes the following key features:

User Module: Manages user registration, information updates, and retrieval.
Auth Module: Supports authentication workflows using JWT, including login, token refresh, and role-based access control.
Testing: Includes comprehensive unit and end-to-end tests to ensure functionality and stability.

## API Documentation

API documentation is provided through the Swagger UI, which can be accessed at [http://localhost:5000/api-doc](http://localhost:5000/api-doc). For some examples, check out this video: [https://www.youtube.com/watch?v=lZmsY0e2ojQ](https://www.youtube.com/watch?v=lZmsY0e2ojQ).

The API documentation is automatically generated using Swagger decorators in each endpoint. These decorators enhance the auto-generated Swagger documentation by adding descriptions, potential response codes, and response types. For instance, in the `updateUser` endpoint:

```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
@Patch('/:id')
@ApiBody({
  description: 'Allowed data to be updated by user',
  type: AdminUpdateUserDto,
})
@ApiBearerAuth()
@ApiOkResponse({ type: User })
@ApiOperation({
  summary: 'Update user by ID',
  description:
    'This endpoint allows an administrator to update user details for any user in the database. Only administrators can access this endpoint.',
})
@ApiNotFoundResponse({ description: 'User not found' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@ApiParam({ name: 'id', description: 'User ID' })
async updateUser(@Param('id') id: string, @Body() body: Partial<User>) {
  return await this.usersService.updateUserByAdmin(id, body);
}
```

This code snippet includes various decorators from the `nestjs/swagger` package:

- `@ApiBody` is used to describe the request body.
- `@ApiOperation` provides summary and description for the API operation.
- `@ApiOkResponse` describes a possible successful response, including its data type.
- `@ApiParam` describes a URL parameter.
- `@ApiBearerAuth` indicates that this route requires bearer token authentication.
- `@ApiNotFoundResponse`, `@ApiUnauthorizedResponse`, and `@ApiForbiddenResponse` provide descriptions of possible error responses.

When you run the application, NestJS will automatically generate an OpenAPI (Swagger) specification. You can see this in action by navigating to `http://localhost:5000/api-doc` where you'll find the Swagger UI presenting all your endpoints and their descriptions interactively.

Remember that having a well-documented API is vital for both front-end developers and other potential users of your API. You should always try to make your API self-descriptive.

### .env Configuration

NestJS uses the `dotenv` module for environment variable management. You can define your configuration in a `.env` file in the root directory of your project. The variables in this file can be accessed via the `ConfigService`.

Here's a quick setup:

1. Install the necessary module: `npm install @nestjs/config`
2. Import `ConfigModule` in your `app.module.ts`:

```typescript
@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

3. Inject and use `ConfigService` to access your environment variables:

```typescript
constructor(private configService: ConfigService) {}

someMethod() {
  const dbUser = this.configService.get<string>('DB_USER');
}
```

For more detailed information, refer to the NestJS configuration documentation: https://docs.nestjs.com/techniques/configuration

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.

Adjust the contents as necessary to align with your project's actual configuration and features.
