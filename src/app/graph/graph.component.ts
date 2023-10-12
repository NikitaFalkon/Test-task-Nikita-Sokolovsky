import {Component, Input} from '@angular/core';
import Chart from "chart.js/auto";
import {IChartJs} from "../../interfaces/chart";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  chart?: IChartJs = undefined;
  chartGraph?: any;
  @Input() set setChart(chart: IChartJs) {
    this.chart = chart;
    this.createChart();
  }

  createChart() {
    if (!this.chart) {
      return
    }

    if (this.chartGraph) {
      this.chartGraph.destroy();
    }

    this.chartGraph = new Chart("MyChart", {
      type: 'line',
      data: this.chart,
      options: {
        aspectRatio: 2.5
      }
    });
  }

}
