import {Component, OnDestroy, OnInit} from '@angular/core';
import {EMPTY, fromEvent, map, Subscription, switchMap} from "rxjs";
import {IChartJs} from "../interfaces/chart";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError} from "rxjs/operators";

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

  constructor(private _snackBar: MatSnackBar) {
  }


  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  ngOnInit(): void {
    const input = document.querySelector('#file');
    if (!input) {
      return;
  }

    this.$sub.add(
      fromEvent(input, 'change').pipe(
        map((event) => {
          const target = event.target as HTMLInputElement;
          return (target.files || [])[0]
        }),
        switchMap(res => {
          return fromPromise(res.text())
        }),
        map(res => {
          return this.isJsonString(res);
        }),
        catchError(() => {
          this._snackBar.open('File upload error!', 'Close',
            {panelClass: 'snack-warning', horizontalPosition: 'end', verticalPosition: 'top', duration: 0});
          return EMPTY;
        }),

      ).subscribe({
        next: data => {
          if (!data) {
            this._snackBar.open('File data is not JSON!', 'Close',
              {panelClass: 'snack-warning', horizontalPosition: 'end', verticalPosition: 'top', duration: 0});
            return;
          }
          this.chartForm = this.clearFormGroup();
          const chart: IChartJs = JSON.parse(data);
          if (!this.checkGraphInform(chart) || !this.graphValidation(chart)) {
            this._snackBar.open('Data type is incorrect!', 'Close',
              {panelClass: 'snack-warning', horizontalPosition: 'end', verticalPosition: 'top', duration: 0});
            return;
          }
          this.chart = chart;
        }
      })
    );

    this.$sub.add(
      fromEvent(input, 'change').subscribe(
        () => {
          (input as HTMLInputElement).value = '';
        }
      )
    );
  }

  checkGraphInform(chart: IChartJs) {
    this.chartForm.patchValue(chart);
    return this.chartForm.status !== 'INVALID';
  }

  graphValidation(chart: IChartJs) {
    try {
      let result: string[] = [];
      if (!chart.datasets || !chart.labels) {
        return false;
      }
      for (let data of chart.datasets) {
        if (result.includes(data.label) || chart.labels.length !== data.data.length || !data.label) {
          return false;
        }
        result.push(data.label);
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  isJsonString(str: unknown): string {
    if (typeof str !== "string") {
      return '';
    }

    try {
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
