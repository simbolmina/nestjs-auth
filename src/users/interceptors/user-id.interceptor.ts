import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('user from interceptor', user);

    if (user && user.id) {
      request.body.userId = user.id;
    }

    console.log('body from interceptor', request.body);

    return next.handle().pipe(
      map((data: any) => {
        // console.log('data from interceptor', data);
        if (user) {
          return { ...data, userId: user.id };
        } else {
          return data;
        }
      }),
    );
  }
}
