// Upload Rate
export const UPLOAD_RATE_TTL = 60000;
export const UPLOAD_RATE_LIMIT = 12;

// App Rate
export const APP_RATE_TTL = 60000;
export const APP_RATE_LIMIT = 60;

// Port
export const PORT = 5000;
export const commonErrorResponses = {
  badRequest: {
    description: 'Returns when input is invalid.',
    schema: {
      example: {
        statusCode: 400,
        message: ['Error message regarding bad input'],
        error: 'Bad Request',
      },
    },
  },
  badUpdateRequest: {
    description: 'Returns when input is invalid for an update operation.',
    schema: {
      example: {
        statusCode: 400,
        message: ['Input format or value is invalid for update'],
        error: 'Bad Request',
      },
    },
  },
  invalidCredentials: {
    description: 'Returns when the provided credentials are invalid.',
    schema: {
      example: {
        statusCode: 401,
        message:
          'Invalid email or password. Please check your login details and try again.',
        error: 'Unauthorized',
      },
    },
  },
  unAuthorized: {
    description:
      'Returns when there is no token available, or the user does not have permission to access the API.',
    schema: {
      example: {
        statusCode: 401,
        message: 'You do not have permission to perform this action.',
        error: 'Unauthorized',
      },
    },
  },
  forbidden: {
    description:
      'Returns when the user is not an admin or does not own the current document.',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have access to this resource.',
        error: 'Forbidden',
      },
    },
  },
  notFound: {
    description: 'Returns when the requested resource (id) is not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'The resource you are trying to access was not found.',
        error: 'Not Found',
      },
    },
  },
  tokenNotFound: {
    description: 'Returns when the token is not found or is expired/invalid.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Token not found or expired.',
        error: 'Not Found',
      },
    },
  },
  unprocessableEntityResponse: {
    description: 'Returns when the user/email already exists.',
    schema: {
      example: {
        statusCode: 422,
        message: 'You cannot register with this email address.',
        error: 'Unprocessable Entity',
      },
    },
  },
  invalidKey: {
    description: 'Returns when the provided token is invalid.',
    schema: {
      example: {
        statusCode: 422,
        message: 'Your key is invalid or has expired.',
        error: 'Unauthorized',
      },
    },
  },
};
