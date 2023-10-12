import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, map, Subscription, switchMap} from "rxjs";
import {IChartJs} from "../interfaces/chart";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'test-project';
  $sub: Subscription = new Subscription();
  chart?: IChartJs = undefined;
  isGraph: boolean = true;
  chartForm: FormGroup = new FormGroup({});


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
          if (!data) {
            alert('File data is not JSON!');
            return;
          }
          this.chartForm = this.clearFormGroup();
          const chart: IChartJs = JSON.parse(data);
          if(!this.checkGraphInform(chart) || !this.graphValidation(chart)) {
            alert('Data type is incorrect!');
            return;
          }
          this.chart = chart;
        }
      })
    );
    this.$sub.add(
      fromEvent(input, 'change').
      subscribe(
        () => {
          (input as HTMLInputElement).value = '';
        }
      )
    );
  }


  checkGraphInform(chart: IChartJs) {
    this.chartForm.patchValue(chart);
    console.log(this.chartForm)
    return this.chartForm.status !== 'INVALID';
  }

  graphValidation(chart: IChartJs) {
    let result: string[] = [];
    if(!chart.datasets || !chart.labels) {
      return false;
    }
    for (let data of chart.datasets) {
      if (result.includes(data.label) || chart.labels.length !== data.data.length) {
        return false;
      }
      result.push(data.label);
    }
    return true;
  }



  isJsonString(str: unknown): string {
    try {
      if (typeof str !== "string") {
        throw "File data is not JSON!";
      }
      JSON.parse(str);
    } catch (e) {
      return '';
    }
    return str;
  }

  clearFormGroup() {
    return new FormGroup({
      "labels": new FormControl([], Validators.minLength(1)),
      "datasets": new FormArray([
      new FormGroup({
        "label": new FormControl('', Validators.required),
        "data": new FormControl([], Validators.minLength(1)),
        "backgroundColor": new FormControl('', Validators.required),
      })
    ], Validators.minLength(1)),
    })
  }
}
