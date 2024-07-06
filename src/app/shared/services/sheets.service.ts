import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import moment from 'moment';
import { map, Observable, tap } from 'rxjs';

import { ApiGoogleSheetsEndpoint } from '../constant';
import { IPaciente, ISheetsResponse } from '../model/commom.model';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  public pacientes = signal<IPaciente[]>([])
  public totalElements = signal<number>(0)
  public totalPages = signal<number>(0)
  public isLoading = signal<boolean>(false)

  constructor(private _http: HttpClient) { }

  getRows(page: number = 0, pageSize: number = 10): Observable<IPaciente[]> {
    return this._http.get<ISheetsResponse>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}`,
      { params: { page, pageSize } })
      .pipe(
        tap(response => {
          this.totalElements.set(response.values.length);
          this.totalPages.set(Math.ceil(this.totalElements() / pageSize));
        }),
        map((response: ISheetsResponse) => {
          if (Array.isArray(response.values)) {
            return response.values.map((item: (string | number)[]): IPaciente => {
              const dataInternacao = moment(item[3] as string, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY');
              return {
                atendimento: Number(item[0]),
                idade: Number(item[1]),
                patologia: item[2] as string,
                internacao: dataInternacao
              };
            }).slice(page * pageSize, (page + 1) * pageSize);
          } else {
            return [];
          }
        }),
      );
  }

  getPatology(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`)
  }

  getTreatments(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Treatments}`)
  }

  deleteRow(rowIndex: number): Observable<any> {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`, { lineId: rowIndex })
  }

  createRow(data: any) {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`, data)
  }


}
