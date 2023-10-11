export interface IChartJs {
  labels: string[],
  datasets: IData[]
}

export interface IData {
  label: string,
  data: string[],
  backgroundColor: string
}
