import { cornerSheet } from './../cornersheet';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { matrix, multiply, transpose, inv, MathNumericType, Matrix, number } from "mathjs";

import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { CornersheetsService } from './../../services/cornersheets.service';
import { ParseFileService } from './../../services/parse-file.service';
import { ConfUnitsComponent } from 'src/app/dialogs/conf-units/conf-units.component';

@Component({
  selector: 'app-addpoint-uploader',
  templateUrl: './addpoint-uploader.component.html',
  styleUrls: ['./addpoint-uploader.component.css']
})
export class AddpointUploaderComponent implements OnInit {

  inputform: FormGroup;
  pointData: any;
  csvData: any;
  csvLoaded =  false;
  recTblColumns =  ['X','Y'];


  recListConverted: any;
  geoListConverted: any;

  // Flags to show if transformation has taken place or not.
  transformed = false;

  @Input() public tabIndex: number = 0;

  constructor(
    private _snackbar: MatSnackBar,
    private fb: FormBuilder,
    private _matdialogue: MatDialog,
    private CornersheetsService: CornersheetsService,
    private fileParser: ParseFileService,
    ) {


    // Rectangular to geodetic form controls
    this.inputform = this.fb.group ({
      X: [5058876.955, Validators.required],
      Y: [3878930.060, Validators.required],
    })



    this.pointData = [];

  }


  receivePointData(event: any) {
    this.csvData = [];
    if(event) {
      this.csvLoaded = true;
      this.csvData = event;
    }
  }


  ngOnInit() { }


  addPoint() {
    this.pointData.push(this.inputform.value);
    // Reset form
    this.inputform.reset();

  }

  // Show a snack bar that informs a user that they can delete a row by doubleClicking
  openSnackBar() {
    const message = 'Double click on a row to delete it.';
    const action = 'OK';
    this._snackbar.open(message, action,{
      duration: 2000,
    });
  }

  reset() {
    this.pointData = [];
    this.transformed = false;
  }

  // Transforming from Cassini to UTM
  CassinitoUTM(conf: boolean, tofeet: boolean) {

    let xyData = this.csvData? this.csvData: this.pointData? this.pointData: 'Error';
    let xArr: number[] = [];
    let yArr: number[] = [];

    // console.log(xyData)
    // Changing string values to number format
    xyData.forEach((el: any) => {
      el.X = +el.X
      el.Y = +el.Y

      if(tofeet == true) {
        el.X = this.CornersheetsService.toFeet(el.X);
        el.Y = this.CornersheetsService.toFeet(el.Y);
      }

      if(conf == true) {
        el.X = this.CornersheetsService.performConformality(el.X);
        el.Y = this.CornersheetsService.performConformality(el.Y);
      }

      xArr.push(el.X);
      yArr.push(el.Y)
    });

    //  retun max and min values;
    const minX = xArr.reduce((a, b) => Math.min(a, b)); // Minimum X value
    const maxX = xArr.reduce((a, b) => { return Math.max(a, b) }); // Maximum X value
    const minY = yArr.reduce((a, b) => Math.min(a, b)); // Minimum Y value
    const maxY = yArr.reduce((a, b) => { return Math.max(a, b) }); // Maximum Y value

    // console.log(minX, maxX, minY, maxY);
    const bVals = this.CornersheetsService.getBox(minX, maxX, minY, maxY);

    let I: any[] = [];
    let A: any[] = [];

    // Matrix I
    I =
    [[bVals.TLUE],[bVals.TLUN],
    [bVals.TRUE],[bVals.TRUN],
    [bVals.BRUE],[bVals.BRUN],
    [bVals.BLUE],[bVals.BLUN]]

    // Main matrix A
    if(bVals.TLCY && bVals.TRCY && bVals.BRCY && bVals.BLCY) {
      A = [
      [bVals.TLCX, -bVals.TLCY, 1, 0],
      [bVals.TLCY, bVals.TLCX, 0, 1],
      [bVals.TRCX, -bVals.TRCY, 1, 0],
      [bVals.TRCY, bVals.TRCX, 0, 1],
      [bVals.BRCX, -bVals.BRCY, 1, 0],
      [bVals.BRCY, bVals.BRCX, 0, 1],
      [bVals.BLCX, -bVals.BLCY, 1, 0],
      [bVals.BLCY, bVals.BLCX, 0, 1],
      ]
    }
    // Transpose(A)I
    if (A.length > 0 && I.length > 0) {
      let matA = matrix(A); // Transform into matrix from array
      let matI = matrix(I);

      let tr_matA = transpose(matA); // Transpose of matrix A

      let tr_matA_matA = multiply(tr_matA, matA) // transpose(A)A

      let invOftr_matA_matA = inv(tr_matA_matA); // Inverse of Transpose(A)A

      let tr_matA_matI = multiply(tr_matA, matI) // transpose(A)I

      let result = multiply(invOftr_matA_matA, tr_matA_matI) // Final result

      let a = result.get([0,0]);
      let b = result.get([1,0]);
      let Tx = result.get([2,0]);
      let Ty = result.get([3,0]);

      const paramArr = [a, b, Tx, Ty];
      let resultArr: any[] = [];
      xyData.forEach((el: { X: number; Y: number; }) => {
        let E = a * el.X - b * el.Y + Tx;
        let N = b * el.X + a * el.Y + Ty;
        let eN = {'E':E, 'N':N};
        resultArr.push(eN);
      });
      console.log(resultArr);

      // Get sheet indexing
      const sheet = bVals.SHEET;
      const index = bVals.INDEX;
      const box_no = bVals.BOX_NO;

      console.log(sheet + '/' + index + '/' + box_no);

      // Then download csv
      this.downloadCSV(resultArr);
      resultArr = [];
      this.transformed = true;
      this.csvLoaded = false;
      this.csvData = [];
      this.pointData = [];
    } else {
      console.log("No corner sheet found");
    }


  }

  // Transforming UTM to Cassini
  UTMtoCassini() {

    let xyData = this.csvData? this.csvData: this.pointData? this.pointData: 'Error';
    let xArr: number[] = [];
    let yArr: number[] = [];

    // console.log(xyData)
    // Changing string values to number format
    xyData.forEach((el: any) => {
      el.X = +el.X
      el.Y = +el.Y

      xArr.push(el.X);
      yArr.push(el.Y)
    });

    //  retun max and min values;
    const minX = xArr.reduce((a, b) => Math.min(a, b)); // Minimum X value
    const maxX = xArr.reduce((a, b) => { return Math.max(a, b) }); // Maximum X value
    const minY = yArr.reduce((a, b) => Math.min(a, b)); // Minimum Y value
    const maxY = yArr.reduce((a, b) => { return Math.max(a, b) }); // Maximum Y value

    // console.log(minX, maxX, minY, maxY);
    const bVals = this.CornersheetsService.getUTMBox(minX, maxX, minY, maxY);

    let I: any[] = [];
    let A: any[] = [];

    // Matrix I
    I =
    [[bVals.TLCX],[bVals.TLCY],
    [bVals.TRCX],[bVals.TRCY],
    [bVals.BRCX],[bVals.BRCY],
    [bVals.BLCX],[bVals.BLCY]]

    // Main matrix A
    if(bVals.TLUN && bVals.TRUN && bVals.BRUN && bVals.BLUN) {
      A = [
      [bVals.TLUE, -bVals.TLUN, 1, 0],
      [bVals.TLUN, bVals.TLUE, 0, 1],
      [bVals.TRUE, -bVals.TRUN, 1, 0],
      [bVals.TRUN, bVals.TRUE, 0, 1],
      [bVals.BRUE, -bVals.BRUN, 1, 0],
      [bVals.BRUN, bVals.BRUE, 0, 1],
      [bVals.BLUE, -bVals.BLUN, 1, 0],
      [bVals.BLUN, bVals.BLUE, 0, 1],
      ]
    }
    // Transpose(A)I
    let matA = matrix(A); // Transform into matrix from array
    let matI = matrix(I);

    let tr_matA = transpose(matA); // Transpose of matrix A

    let tr_matA_matA = multiply(tr_matA, matA) // transpose(A)A

    let invOftr_matA_matA = inv(tr_matA_matA); // Inverse of Transpose(A)A

    let tr_matA_matI = multiply(tr_matA, matI) // transpose(A)I

    let result = multiply(invOftr_matA_matA, tr_matA_matI) // Final result

    let a = result.get([0,0]);
    let b = result.get([1,0]);
    let Tx = result.get([2,0]);
    let Ty = result.get([3,0]);

    const paramArr = [a, b, Tx, Ty];
    let resultArr: any[] = [];
    xyData.forEach((el: { X: number; Y: number; }) => {
      let E = a * el.X - b * el.Y + Tx;
      let N = b * el.X + a * el.Y + Ty;
      let eN = {'E':E, 'N':N};
      resultArr.push(eN);
    });
    console.log(resultArr);

    // Get sheet indexing
    const sheet = bVals.SHEET;
    const index = bVals.INDEX;
    const box_no = bVals.BOX_NO;

    console.log(sheet + '/' + index + '/' + box_no);

    // Then download csv
    this.downloadCSV(resultArr);
    resultArr = [];
    this.transformed = true;
    this.csvLoaded = false;
    this.csvData = [];
    this.pointData = [];
  }

  // Promping Dialog to convert to feet and add conformality to eastings.
  promptDialog() {
    const dialogRef = this._matdialogue.open(ConfUnitsComponent, );


    dialogRef.afterClosed().subscribe(result => {
      this.CassinitoUTM(result.conf, result.tofeet);
    });
  }

  // deleterow
  deleteRow(arr: Array<number>,i: number) {
    arr.splice(i, 1);
  }



downloadCSV (data: any) {

  const csvRows = [];

  /* Get headers as every csv data format
  has header (head means column name)
  so objects key is nothing but column name
  for csv data using Object.key() function.
  We fetch key of object as column name for
  csv */
  const headers = Object.keys(data[0]);

  /* Using push() method we push fetched
     data into csvRows[] array */
  csvRows.push(headers.join(','));

  // Loop to get value of each objects key
  for (const row of data) {
      const values = headers.map(header => {
          const val = row[header]
          return `"${val}"`;
      });

      // To add, sepearater between each value
      csvRows.push(values.join(','));
  }
  // csvRows.join("\n");
  // console.log(csvRows);
  let downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", csvRows.join("\n")]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "data.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  }

  downloadCSV01() {
    console.log("this is a link");
  }
}
