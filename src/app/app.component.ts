import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, map, Subscription, switchMap} from "rxjs";
import {IChartJs, ITableClass} from "../interfaces/chart";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'test-project';
  $sub: Subscription = new Subscription();
  chart?: IChartJs = undefined;
  chartGraph?: any;
  displayedColumns: string[] = []
  dataTable: string[][] = [];
  dataMap: Map<string, string[]> = new Map<string, string[]>();
  index: number[] = [];

  objArray: any[] = []


  tableArray: ITableClass[] = []

  chartForm: FormGroup = new FormGroup({
    "labels": new FormControl('', Validators.minLength(1)),
    "datasets": new FormArray([
      new FormGroup({
        "label": new FormControl('', Validators.required),
        "data": new FormControl([], Validators.minLength(1)),
        "backgroundColor": new FormControl('', Validators.required),
      })
    ]),
  });


  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  ngOnInit(): void {
    const input = document.querySelector('#file');
    if (!input) {
      return;
    }

    // @ts-ignore
    this.$sub.add(
      fromEvent(input, 'change').pipe(
        // @ts-ignore
        map(() => input.files[0]),
        switchMap(res => {
          return fromPromise(res.text())
        }),
        map(res => {
          return this.isJsonString(res);
        })
      ).subscribe({
        next: data => {
          console.log('>>',data)
          if (!data) {

            alert('File is incorrect!');
            return;
          }
          const chart: IChartJs = JSON.parse(data);
          if(!this.checkGraphInform(chart)) {
            alert('File is incorrect!');
            return;
          }
          this.chart = chart;
          this.createChart()
        }
      })
    );
  }


  checkGraphInform(chart: IChartJs) {
    this.chartForm.patchValue(chart);
    console.log(this.chartForm)
    return this.chartForm.status !== 'INVALID';
  }


  isJsonString(str: unknown): string {
    try {
      if (typeof str !== "string") {
        throw "File is incorrect";
      }
      JSON.parse(str);
    } catch (e) {
      return '';
    }
    return str;
  }

  createChart(){
    if(!this.chart) {
      return
    }

    this.createTable();

    this.chartGraph = new Chart("MyChart", {
      type: 'line',

      data: this.chart,
      options: {
        aspectRatio:2.5
      }
    });
  }

  createTable() {
    if(!this.chart) {
      return;
    }

    this.displayedColumns.push('Date')

    this.chart.datasets.forEach(data => {
      this.displayedColumns.push(data.label);
    });

    this.chart.labels.forEach(label => {
      let tableClass: ITableClass = {
        Date: label
      }
      this.tableArray.push(tableClass);
    })

    this.displayedColumns.forEach((display, index) => {
      this.tableArray.forEach((tableCl) => {
        if(index !== 0) {
          tableCl[display] = '';
        }
      })
    })

    this.chart.datasets.forEach((data) => {
      this.tableArray.forEach((tableData, index) => {
        tableData[data.label] = data.data[index];
      })
    })

    console.log('>this.tableArray>',this.tableArray)




    this.chart.datasets.forEach(data => {
      const array = [data.label].concat(data.data);
      this.dataTable.push(array);
    });

    let arr = this.rotateArr(this.dataTable);
    let ind = 0;
    this.displayedColumns.forEach(displayed => {
      this.dataMap.set(displayed, arr[ind]);
      this.index.push(ind);
      ind++;
    })

    console.log('>this.dataTable>',this.dataMap)

  }

  rotateArr(arr: string[][]){
    let newArr= [];
    let newRows = arr[0].length;
    let newColumns = arr.length;
    for(let x = 0; x < newRows; x++){
      let row_arr = []; // это элемент из нового массива
      for(let y = (newColumns-1), z = 0; y >= 0; y--, z++){
        row_arr[z] = arr[y][x];
      }
      newArr[x] = row_arr;
    }
    return newArr;
  };


}
