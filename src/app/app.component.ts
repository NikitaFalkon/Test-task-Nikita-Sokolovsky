import { Component } from '@angular/core';

import {fromEvent, map, Subscription} from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-project';
  $sub: Subscription = new Subscription();


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
      ).subscribe({
        next: data => {
          this.checkIsJSON(data);
        }
      })
    );
  }

  /*  createGraph(jsonData: any) {
    }*/

  checkIsJSON(file: File) {
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      try {
        if (typeof reader.result !== "string") {
          throw "File is incorrect";
        }
        JSON.parse(reader.result);
      } catch (err) {
        alert('File is incorrect!');
      }
    };
  }
}
