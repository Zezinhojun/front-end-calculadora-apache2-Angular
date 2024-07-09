import { Observable } from 'rxjs';
import { IPaciente } from '../../model/commom.model';

export default interface ISheetService {
  getRows(page?: number, pageSize?: number): Observable<IPaciente[]>;
  getPatology(): Observable<any>;
  getTreatments(): Observable<any>;
  findRow(lineId: number): Observable<IPaciente>;
  deleteRow(lineId: number): Observable<any>;
  createRow(lineId: string, record: Partial<IPaciente>): Observable<Object>;
  updateRow(lineId: number, record: IPaciente): Observable<IPaciente>;
}
