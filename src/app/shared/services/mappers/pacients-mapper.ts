import moment from 'moment';
import { IPaciente } from '../../model/commom.model';
import { TabelaAPache } from '../../../components/result-table/result-table.component';

export default class PacienteMapper {
  static calculateDateDifference(start: Date, end: Date): number {
    return moment(end).diff(moment(start), 'days');
  }
  static formatDate(date: any): string {
    return moment(date).format('DD/MM/YYYY');
  }

  static findLineForValue(
    value: number,
    elementData: TabelaAPache[],
  ): number | null {
    for (const item of elementData) {
      const currentRange = item.pontos.split(' - ');
      const minPoints = parseInt(currentRange[0].replace('0 - ', ''));
      const maxPoints = parseInt(currentRange[1].replace(' pontos', ''));

      if (value >= minPoints && value <= maxPoints) {
        return elementData.indexOf(item);
      }
    }
    return null;
  }

  static fromSheetsResponse(values: (string | number)[]): IPaciente {
    const dataInternacao = moment(
      values[3] as string,
      'DD/MM/YYYY HH:mm:ss',
    ).isValid()
      ? moment(values[3] as string, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')
      : '';
    return {
      atendimento: Number(values[0]),
      idade: Number(values[1]),
      patologia: values[2] as string,
      internacao: dataInternacao,
    };
  }

  static formatFormData(formData: any): any {
    if (formData.glim && formData.internacao) {
      formData.glim = this.formatDate(formData.glim);
      formData.internacao = this.formatDate(formData.internacao);
    }

    return {
      values: [
        [
          formData.atendimento,
          formData.age,
          formData.patologia,
          formData.internacao,
          formData.glim,
          formData.dignosticoGlim,
          formData.desfecho,
          formData.sexo,
          formData.tempoDeInternacao,
          formData.falenciaOrImuno,
          formData.temperatura,
          formData.pressao,
          formData.freqCardiaca,
          formData.freqRespiratoria,
          formData.pao2,
          formData.phOrHco3,
          formData.sodio,
          formData.potassio,
          formData.creatinina,
          formData.hematocrito,
          formData.leucocitos,
          formData.glasgow,
          formData.ageApache,
          formData.criticalHealth,
          formData.totalApache,
        ],
      ],
    };
  }
}
