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
    const lineId = 'ID_DO_PACIENTE'; // Substitua isso pelo mecanismo real para obter o lineId
    return this._sheetSvc.createRow(requestBody);
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
