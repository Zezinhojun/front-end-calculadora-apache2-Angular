import moment from "moment";
import { IPaciente } from "../model/commom.model";

export default class PacienteMapper {
  static fromSheetsResponse(values: (string | number)[]): IPaciente {
    const dataInternacao = moment(values[3] as string, 'DD/MM/YYYY HH:mm:ss').isValid()
      ? moment(values[3] as string, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')
      : '';

    return {
      atendimento: Number(values[0]),
      idade: Number(values[1]),
      patologia: values[2] as string,
      internacao: dataInternacao,

    };
  }
}
