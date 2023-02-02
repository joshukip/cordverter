import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MatSnackBar} from '@angular/material/snack-bar';

import { Ellipsoid } from './../ellipsoid';
import { EllipsoidsService } from '../services/ellipsoids.service';
import { CalculationsService } from './../services/calculations.service';
import { ParseFileService } from './../services/parse-file.service';
import { FilestorageService } from '../services/filestorage.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})

export class ConvertComponent implements OnInit {

  inputform: FormGroup;
  geotoRecForm: FormGroup;
  recList: any;
  geoList: any;
  plainGeoList: any; // Geodetic array with no degree, minute or second symbols.
  recTblColumns =  ['X','Y','Z'];
  geoTblColumns = ['LATITUDE','LONGITUDE','HEIGHT'];

  ellipsoids: Ellipsoid[];
  selectedOption: string = '4';

  recListConverted: any;
  geoListConverted: any;

  // Flags to show if conversion has taken place or not.
  converted = false;

  constructor(
    private _snackbar: MatSnackBar,
    private fb: FormBuilder,
    private ellipsoidsService: EllipsoidsService,
    private calculationsService: CalculationsService,
    private fileParser: ParseFileService,
    private fileStorage: FilestorageService,
    ) {

    this.ellipsoids = this.ellipsoidsService.getAllEllipsoids();

    // Rectangular to geodetic form controls
    this.inputform = this.fb.group ({
      x: [5058876.955, Validators.required],
      y: [3878930.060, Validators.required],
      z: [249870.507]
    })

    // geodetic to rectangular form controls
    this.geotoRecForm = this.fb.group ({
      latdeg: [2, Validators.required],
      latmin: [15, Validators.required],
      latsec: [36, Validators.required],
      longdeg: [37, Validators.required],
      longmin: [28, Validators.required],
      longsec: [46, Validators.required],
      height: [1500, Validators.required]
    })

    this.recList = [];
    this.geoList = [];
    this.plainGeoList = [];
    this.recListConverted = [];
    this.geoListConverted = [];

  }


  receiveRecData(event: any) {
    // console.log(event);
    this.recList = [];
    this.recList = event;
  }

  receiveGeoData(event: any) {
    console.log(event);
    // console.log(this.fileStorage);
    this.plainGeoList = [];

    for (let a in event) {

      // The CSV file should have LATDEG, LATMIN, LATSEC, LONGDEG, LONGMIN, LONGSEC, HEIGHT headers and columns.

      let symboledlatitude = `${event[a].LATDEG}° ${event[a].LATMIN}' ${event[a].LATSEC}”`;
      let symboledlongitude = `${event[a].LONGDEG}° ${event[a].LONGMIN}' ${event[a].LONGSEC}”`;
      let symboledheight = `${event[a].HEIGHT}m`;

      let allVals = {symboledlatitude,symboledlongitude,symboledheight}
      this.geoList.push(allVals)

      let lat = [+event[a].LATDEG, +event[a].LATMIN, +event[a].LATSEC];
      let lon = [+event[a].LONGDEG, +event[a].LONGMIN, +event[a].LONGSEC]
      let height = +event[a].HEIGHT;


      let latitude = this.calculationsService.convertDMStoDD(lat);
      let longitude = this.calculationsService.convertDMStoDD(lon);

      let plainValues = {latitude, longitude, height};

      this.plainGeoList.push(plainValues);
    }
    // console.log(this.plainGeoList);
  }

  ngOnInit() { }


  addRecPoint() {
    this.recList.push(this.inputform.value);


    // Reset form
    // this.inputform.reset();

  }

  // geodetic to rectangular
  addGeoPoint() {
    let symboledlatitude = `${this.geotoRecForm.value.latdeg}° ${this.geotoRecForm.value.latmin}' ${this.geotoRecForm.value.latsec}”`;
    let symboledlongitude = `${this.geotoRecForm.value.longdeg}° ${this.geotoRecForm.value.longmin}' ${this.geotoRecForm.value.longsec}”`;
    let symboledheight = `${this.geotoRecForm.value.height}m`;

    let allVals = {symboledlatitude,symboledlongitude,symboledheight}
    this.geoList.push(allVals)

    // Add geopoints without degrees, minutes and seconds symbols.
    let lat = [this.geotoRecForm.value.latdeg, this.geotoRecForm.value.latmin, this.geotoRecForm.value.latsec];
    let lon = [this.geotoRecForm.value.longdeg, this.geotoRecForm.value.longmin, this.geotoRecForm.value.longsec];
    let height = this.geotoRecForm.value.height;

    // Convert latitude and longitude to decimal degrees
    let latitude = this.calculationsService.convertDMStoDD(lat);
    let longitude = this.calculationsService.convertDMStoDD(lon);

    let plainValues = {latitude, longitude, height};
    this.plainGeoList.push(plainValues);

    // Reset Form
    // this.geotoRecForm.reset();
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
    this.recList = [];
    this.geoList = [];
    this.plainGeoList = [];
    this.converted = false;
  }


  converttoRec() {
    let current = this.ellipsoidsService.getEllipsoid(this.selectedOption);
    let a = current.a;
    let f = current.f;

    for (let i in this.plainGeoList){
      let lat = +this.plainGeoList[i].latitude;
      let lon = +this.plainGeoList[i].longitude;
      let h = +this.plainGeoList[i].height;

      this.recListConverted.push(this.calculationsService.geodeticToRec(lat, lon, h, a, f))
    }

    // console.log(this.recListConverted)
    this.converted = true;

    // Then download csv
    // this.downloadCSV(this.recListConverted);
    this.recListConverted = [];
  }

  converttoGeo() {
    let current = this.ellipsoidsService.getEllipsoid(this.selectedOption);
    let a = current.a;
    let f = current.f;

    for (let i in this.recList){

      let x = +this.recList[i].x;
      let y = +this.recList[i].y;
      let z = +this.recList[i].z;

      this.geoListConverted.push(this.calculationsService.recToGeodetic(x, y, z, a, f))

    }

    // console.log(this.geoListConverted)
    this.converted = true;

    // Then download csv
    this.downloadCSV(this.geoListConverted);
    this.geoListConverted = [];
  }

  // deleterow
  deleteRow(arr: Array<number>,i: number) {
    arr.splice(i, 1);
  }

//   downloadCSV(itemsArray: any) {
//     const csvString = [
//       [
//         "x",
//         "y",
//         "z"
//       ],
//       ...itemsArray.map((item: any) => [
//         item.x,
//         item.y,
//         item.z
//       ])
//     ]
//      .map(e => e.join(","))
//      .join("\n");

//     // console.log(csvString);
    // var downloadLink = document.createElement("a");
    // var blob = new Blob(["\ufeff", csvString]);
    // var url = URL.createObjectURL(blob);
    // downloadLink.href = url;
    // downloadLink.download = "data.csv";

    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
//   }
// }

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
    this.fileStorage.rectoGeoCSV()
  }

}
