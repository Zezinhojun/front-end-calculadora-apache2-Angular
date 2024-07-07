import { Observable } from "rxjs";
import { IPaciente } from "../../model/commom.model";

export default interface ISheetService {
  getRows(page?: number, pageSize?: number): Observable<IPaciente[]>;
  getPatology(): Observable<any>
  getTreatments(): Observable<any>;
  deleteRow(lineId: number): Observable<any>
  createRow(data: any): Observable<any>
  updateRow(lineId: number): Observable<IPaciente>
}
