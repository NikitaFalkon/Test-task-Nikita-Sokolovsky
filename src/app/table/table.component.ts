import {Component, Input, OnInit} from '@angular/core';
import {IChartJs, ITableClass} from "../../interfaces/chart";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() chart?: IChartJs = undefined;
  displayedColumns: string[] = [];
  tableArray: ITableClass[] = [];
  filteredArray: ITableClass[] = [];
  dataSource = new MatTableDataSource(this.tableArray);

  ngOnInit(): void {
    this.createTable();
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

    this.filteredArray = this.tableArray;
  }

  applyFilter(event: Event) {
    const id = (event.target as HTMLInputElement).id;
    const filterValue = (event.target as HTMLInputElement).value;
    if(!filterValue) {
      this.filteredArray = this.tableArray;
    }
    this.filteredArray = this.tableArray.filter(arrMember => arrMember[id].toString().includes(filterValue));
  }

}
