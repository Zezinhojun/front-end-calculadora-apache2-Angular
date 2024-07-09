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
  static parseDate(dateString: string): Date | null {
    const parsedDate = moment(dateString, 'DD/MM/YYYY', true);
    return parsedDate.isValid() ? parsedDate.toDate() : null;
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
    const atendimento = Number(values[0]);
    const idade = Number(values[1]);
    const patologia = values[2].toString();
    const dignosticoGlim = values[5].toString();
    const desfecho = values[6].toString();
    const sexo = values[7].toString();
    const falenciaOrImuno = values[9].toString();
    const temperatura = values[10].toString();
    const pressao = values[11].toString();
    const freqCardiaca = values[12].toString();
    const freqRespiratoria = values[13].toString();
    const pao2 = values[14].toString();
    const phOrHco3 = values[15].toString();
    const sodio = values[16].toString();
    const potassio = values[17].toString();
    const creatinina = values[18].toString();
    const hematocrito = values[19].toString();
    const leucocitos = values[20].toString();
    const ageApache = values[21].toString();
    const glasgow = values[22].toString();
    const criticalHealth = values[23].toString();

    let internacao: Date | null = null;
    if (values[3] && typeof values[3] === 'string') {
      const dataInternacao = moment(values[3], 'DD/MM/YYYY HH:mm:ss', true);
      internacao = dataInternacao.isValid() ? dataInternacao.toDate() : null;
    }

    let glim: Date | null = null;
    if (values[4] && typeof values[4] === 'string') {
      const dataGlim = moment(values[4], 'DD/MM/YYYY HH:mm:ss', true);
      glim = dataGlim.isValid() ? dataGlim.toDate() : null;
    }

    return {
      atendimento,
      idade,
      patologia,
      internacao,
      glim,
      dignosticoGlim,
      desfecho,
      sexo,
      falenciaOrImuno,
      temperatura,
      pressao,
      freqCardiaca,
      freqRespiratoria,
      pao2,
      phOrHco3,
      sodio,
      potassio,
      creatinina,
      hematocrito,
      leucocitos,
      glasgow,
      ageApache,
      criticalHealth,
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
