import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        let errorMessage;
        if (errorResponse.error.message) {
          errorMessage = errorResponse.error.message;
        } else {
          errorMessage = 'Something went wrong!';
        }
        this.snackBar.open(
          errorMessage, 'OK', {
            duration: 3000,
          });
        return throwError(() => errorResponse);
      })
    );
  }
}
