import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import PacienteMapper from '../mappers/pacients-mapper';
import { ApiGoogleSheetsEndpoint } from '../../constant';
import { IPaciente, ISheetsResponse } from '../../model/commom.model';
import ISheetService from './sheets.service.interface';

@Injectable({
  providedIn: 'root',
})
export class SheetsService implements ISheetService {
  public pacientes = signal<IPaciente[]>([]);
  public totalElements = signal<number>(0);
  public totalPages = signal<number>(0);
  public isLoading = signal<boolean>(false);

  constructor(private _http: HttpClient) {}

  updateRow(lineId: number): Observable<IPaciente> {
    throw new Error('Method not implemented.');
  }

  getRows(page: number = 0, pageSize: number = 10): Observable<IPaciente[]> {
    return this._http
      .get<ISheetsResponse>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}`, {
        params: { page, pageSize },
      })
      .pipe(
        tap((response) => {
          this.totalElements.set(response.values.length);
          this.totalPages.set(Math.ceil(this.totalElements() / pageSize));
        }),
        map((response: ISheetsResponse) => {
          if (Array.isArray(response.values)) {
            return response.values
              .map(PacienteMapper.fromSheetsResponse)
              .slice(page * pageSize, (page + 1) * pageSize);
          } else {
            return [];
          }
        }),
      );
  }

  getPatology(): Observable<any> {
    return this._http.get<any>(
      `${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`,
    );
  }

  getTreatments(): Observable<any> {
    return this._http.get<any>(
      `${ApiGoogleSheetsEndpoint.GoogleSheets.Treatments}`,
    );
  }

  deleteRow(rowIndex: number): Observable<boolean> {
    return this._http.post<boolean>(
      `${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`,
      { lineId: rowIndex },
    );
  }

  createRow(data: any) {
    return this._http.post(
      `${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`,
      data,
    );
  }
}
