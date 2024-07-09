import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { SheetsService } from '../services/sheets/sheets.service';
import { IPaciente } from '../model/commom.model';
import { Observable, of } from 'rxjs';

export const pacienteResolver: ResolveFn<IPaciente> = (
  route,
  state,
): Observable<IPaciente> => {
  const _sheetSvc = inject(SheetsService);
  if (route?.params['lineId']) {
    const lineId = Number(route.params['lineId']);
    console.log('lineId:', lineId);
    return _sheetSvc.findRow(lineId);
  }
  return of({
    atendimento: 0,
    idade: 3,
    patologia: '',
    internacao: null,
    glim: null,
    dignosticoGlim: '',
    desfecho: '',
    sexo: '',
    falenciaOrImuno: '',
    temperatura: '',
    pressao: '',
    freqCardiaca: '',
    freqRespiratoria: '',
    pao2: '',
    phOrHco3: '',
    sodio: '',
    potassio: '',
    creatinina: '',
    hematocrito: '',
    leucocitos: '',
    glasgow: '',
    ageApache: '',
    criticalHealth: '',
  });
};
