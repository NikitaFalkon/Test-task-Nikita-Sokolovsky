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




}
