export interface IChart {
  title: string;
  type: string;
  data: any[][];
  columnNames: string[];
  options?: IOptions;
}

export interface IOptions  {
  hAxis: IAxis,
  vAxis: IAxis,
}

export interface IAxis  {
  title: string
}
