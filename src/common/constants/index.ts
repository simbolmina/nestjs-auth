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
    description: 'Returns when input is invalid.',
    schema: {
      example: {
        statusCode: 400,
        message: ['Input format or value is invalid'],
        error: 'Bad Request',
      },
    },
  },
  invalidCredentials: {
    description: 'Returns when input is not valid',
    schema: {
      example: {
        statusCode: 401,
        message:
          'Emamil veya şifreniz hatalı. Giriş bilgilerinizi kontrol ederek yeniden deneyiniz.',
        error: 'Unauthorized',
      },
    },
  },
  unAuthorized: {
    description:
      'Returns when there is no token available or user does not have permission to access the API',
    schema: {
      example: {
        statusCode: 401,
        message: 'Bu işlemi yapmak için yetkiniz yok.',
        error: 'UnAuthorized',
      },
    },
  },
  forbidden: {
    description:
      'Returns when user is not admin or user does not own the current document',
    schema: {
      example: {
        statusCode: 403,
        message: 'Bu kaynağa erişim izniniz yok.',
        error: 'Forbidden',
      },
    },
  },
  notFound: {
    description: 'Returns when document (id) not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Erişmeye çalıştığınız kaynak bulunamadı.',
        error: 'Not Found',
      },
    },
  },
  tokenNotFound: {
    description: 'Returns when token is not found or expired/invalid',
    schema: {
      example: {
        statusCode: 404,
        message: 'Geçersiz veya süresi dolmuş anahtar.',
        error: 'Not Found',
      },
    },
  },
  unprocessableEntityResponse: {
    description: 'Returns when user/email already exists',
    schema: {
      example: {
        statusCode: 422,
        message: 'Bu e-posta ile kaydolamazsınız.',
        error: 'Unprocessable Entity',
      },
    },
  },
  invalidKey: {
    description: 'Returns when token is invalid ',
    schema: {
      example: {
        statusCode: 422,
        message: 'Anahtarınız geçersiz veya süresi dolmuş',
        error: 'UnAuthorized',
      },
    },
  },
};
