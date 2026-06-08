
export interface StaticDataFormModel {
  dataKey: string;
  dataText: string;
  dataValue: string;
  isDefaultValue?: boolean;
}

export interface StaticData extends StaticDataFormModel {
  id: number;
}