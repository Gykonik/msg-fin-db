import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * USAGE:
 *
 * @example
 * someMethod() {
 *   this.dataService.getData('users').subscribe(
 *     data => {
 *       console.log(data);
 *     },
 *     error => {
 *       console.error(error);
 *     }
 *   );
 * }
 */
@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl: string = 'http://localhost:8080/api'; // Replace with your API URL

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient) {
    }

    // GET request to retrieve data
    getData(endpoint: string, params?: HttpParams): Observable<any> {
        return this.http.get(`${this.apiUrl}/${endpoint}`, {headers: this.httpOptions.headers, params})
            .pipe(
                catchError(this.handleError)
            );
    }


    // POST request to send data
    postData(endpoint: string, data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${endpoint}`, data, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    // PUT request to update data
    updateData(endpoint: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${endpoint}`, data, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    // DELETE request
    deleteData(endpoint: string, body?: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${endpoint}`, {...this.httpOptions, body})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Error handling
    private handleError(error: any): Observable<never> {
        // Implement error handling logic
        // For instance, logging the error or displaying a notification
        console.error('An error occurred:', error.error.message);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
