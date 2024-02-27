import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

// const getCurrentUserByContext = (context: ExecutionContext): User => {
//   const user = context.switchToHttp().getRequest().user;
//   console.log('user', user);
//   return user;
// };

// export const CurrentUser = createParamDecorator(
//   (_data: unknown, context: ExecutionContext) =>
//     getCurrentUserByContext(context),
// );
