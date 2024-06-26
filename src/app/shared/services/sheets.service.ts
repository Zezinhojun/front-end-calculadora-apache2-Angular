import { IPaciente } from './../model/commom.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, take, tap } from 'rxjs';

import { ApiGoogleSheetsEndpoint } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  // public pacientes = signal<IPaciente[]>([])
  public totalElements = signal<number>(0)
  public totalPages = signal<number>(0)
  public isLoading = signal<boolean>(false)

  constructor(private _http: HttpClient) { }

  getRows(page: number = 0, pageSize: number = 10) {
    this.isLoading.set(true)
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}`,
      { params: { page, pageSize } })
      .pipe(
        take(1),
        tap(response => {
          this.totalElements.set(response.values.length);
          this.totalPages.set(Math.ceil(this.totalElements() / pageSize));
          this.isLoading.set(false)
        })
      );
  }

  getPatology(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`)
  }

  getService(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Service}`)
  }

  deleteRow(rowIndex: number): Observable<any> {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`, { lineId: rowIndex })
  }

  createRow(data: any) {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`, data)
  }


}
