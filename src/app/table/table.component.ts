import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {IChartJs, ITableClass} from "../../interfaces/chart";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  chart?: IChartJs = undefined;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  displayedColumns: string[] = [];
  tableArray: ITableClass[] = [];
  filteredArray: ITableClass[] = [];
  dataSource = new MatTableDataSource(this.filteredArray);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private _liveAnnouncer: LiveAnnouncer) {
  }

  @Input() set setChart(chart: IChartJs) {
    this.chart = chart;
    this.createTable();
  }


  createTable() {
    if (!this.chart) {
      return;
    }

    this.displayedColumns = [];
    this.tableArray = [];
    this.filteredArray = [];

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
        if (index !== 0) {
          tableCl[display] = '';
        }
      })
    })

    this.chart.datasets.forEach((data) => {
      this.tableArray.forEach((tableData, index) => {
        tableData[data.label] = data.data[index];
      })
    })

    this.filteredArray = this.tableArray;
    this.dataSource.data = this.filteredArray;
  }

  applyFilter(event: Event) {
    const id = (event.target as HTMLInputElement).id;
    const filterValue = (event.target as HTMLInputElement).value;
    if (!filterValue) {
      this.filteredArray = this.tableArray;
    }
    this.filteredArray = this.tableArray.filter(arrMember => arrMember[id].toString().includes(filterValue));
    this.dataSource.data = this.filteredArray;
  }

}
