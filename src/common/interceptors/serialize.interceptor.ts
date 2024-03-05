import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

//argument should be a class
interface ClassConstructor {
  new (...args: any[]): {};
}

//the class satisfy the NestInterceptor interface
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before a request is handled by the request handler
    //console.log('I am running before the handler', context.getArgByIndex);

    return handler.handle().pipe(
      map((data: any) => {
        if (data && data.user) {
          data.user = plainToInstance(this.dto, data.user, {
            excludeExtraneousValues: true,
          });
          return data;
        }
        //Run something before the response is sent out
        //console.log('I am running before response is sent out', data);
        // Add this block to handle objects with a 'data' property
        if (data && data.data) {
          data.data = plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
          });
          return data;
        }

        return plainToInstance(this.dto, data, {
          //ensure that the returned object is an instance of UserDto with Expose decorator
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
