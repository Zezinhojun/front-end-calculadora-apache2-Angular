import { Injectable } from '@angular/core';
import { SheetsService } from '../sheets/sheets.service';
import PacienteMapper from '../mappers/pacients-mapper';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private atendimentoList = new BehaviorSubject<number[]>([]);
  constructor(private _sheetSvc: SheetsService) {}

  createPaciente(formData: any) {
    const requestBody = PacienteMapper.formatFormData(formData);
    return this._sheetSvc.save(requestBody);
  }

  updatePaciente(dataToUpdate: any): Observable<any> {
    return this._sheetSvc.save(dataToUpdate);
  }

  filterPatologies(patologies: string[], filterValue: string): string[] {
    return patologies.filter((option) =>
      option.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }

  getPatology(): Observable<any> {
    return this._sheetSvc.getPatology();
  }

  fetchTreatments(): void {
    this._sheetSvc.getTreatments().subscribe({
      next: (data) => {
        const atendimentoList = data.values.map((item: any[]) =>
          Number(item[0]),
        );
        this.atendimentoList.next(atendimentoList);
      },
    });
  }

  getTreatmentList(): Observable<number[]> {
    return this.atendimentoList.asObservable();
  }
}
