// AWS
export const AWS_BUCKET_REGION = 'eu-central-1';
export const AWS_REGION = 'eu-central-1';
export const AWS_PRIVATE_BUCKET_NAME = 'tevkil-hukuk';
export const AWS_PUBLIC_BUCKET_NAME = 'nestjs-image-upload';
export const AWS_NOREPLY_EMAIL = 'noreply@tevkil-back.falciapp.net';

// Upload Rate
export const UPLOAD_RATE_TTL = 60000;
export const UPLOAD_RATE_LIMIT = 12;

// Image Upload Sıze Lımıt
export const MAX_ALLOWED_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
export const MAX_ALLOWED_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

// App Rate
export const APP_RATE_TTL = 60000;
export const APP_RATE_LIMIT = 60;

// Port
export const PORT = 5000;

// Apple Client ID
export const APPLE_CLIENT_ID = 'com.theatech.tevkil.debug';

//Open AI Models
export const DEFAULT_MODEL_ID = 'gpt-4-1106-preview';

export const GEMINI_PROMPT =
  "Hello, I'm creating a lawyer only mobil app where lawyers will hire each other. I request lawyers fill up their ID information after signing up then I review their personal info and admin personnel approve their account. I thought I could use you to extract the information of the id cards during siging up and fill up the form for the better user experience. Thats why I am sahing this id card image and I want following info: { barName, firstName, lastName, barNo, tbbNo, tcNo } as in order of the id card. Give me these info in a json file format. This is not a classfied document and sharing this won't cause any problems accordingly Turkish Laws";

export const LAMBDA_ENDPOINT =
  'https://tisat1795g.execute-api.us-east-1.amazonaws.com/dev/analyze';

// Constants example
export const SUCCESS_URL = 'https://tevkil-back.falciapp.net/payments/success';
export const FAILURE_URL = 'https://tevkil-back.falciapp.net/payments/failure';

export const PAYTR_CREATE_TOKEN_URL =
  'https://www.paytr.com/odeme/api/get-token';

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
  badGoogleRequest: {
    description: 'Returns when input is invalid',
    schema: {
      example: {
        statusCode: 400,
        message: 'Geçersiz veya süresi dolmuş Google ID token',
        error: 'Bad Request',
      },
    },
  },
  badAppleRequest: {
    description: 'Returns when input is not valid',
    schema: {
      example: {
        statusCode: 400,
        message: 'Geçersiz veya süresi dolmuş AppleId Token',
        error: 'Bad Request',
      },
    },
  },
  badOfferRequest: {
    description: 'Returns when input is not valid',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Error message regarding bad input',
          'Kendi ilanınıza teklifte bulunamazsınız.',
        ],
        error: 'Bad Request',
      },
    },
  },
  badAppleGoogleRequest: {
    description:
      'Returns when user reregister with existing users mail address using google/apple login',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Bu mail adresiyle daha önce farklı bir yöntemle kaydolmuşsunuz.',
        error: 'Bad Request',
      },
    },
  },
  unexpectedField: {
    description: 'Returns when field name is wrong',
    schema: {
      example: {
        statusCode: 400,
        message: 'Unexpected field',
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
