import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;

        const now = Date.now();
        console.log(`[Request] ${method} ${url}`);

        return next.handle().pipe(
            tap(() => {
                const ms = Date.now() - now;
                console.log(`[Response] ${method} ${url} - ${ms}ms`);
            }),
        );
    }
}
