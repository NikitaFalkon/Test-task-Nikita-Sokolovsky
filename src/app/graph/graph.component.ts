import {Component, Input, OnInit} from '@angular/core';
import Chart from "chart.js/auto";
import {IChartJs} from "../../interfaces/chart";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() chart?: IChartJs = undefined;
  chartGraph?: any;
  ngOnInit(): void {
    this.createChart()
  }
  createChart(){
    console.log('>>',this.chart)
    if(!this.chart) {
      return
    }


    this.chartGraph = new Chart("MyChart", {
      type: 'line',
      data: this.chart,
      options: {
        aspectRatio:2.5
      }
    });
  }

}
