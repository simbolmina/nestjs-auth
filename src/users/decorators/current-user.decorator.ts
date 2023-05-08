import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    return request.user;
  },
);

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const CurrentUser = createParamDecorator(
//   (data: never, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     console.log(request.session.userId);
//     return 'hi there';
//   },
// );
