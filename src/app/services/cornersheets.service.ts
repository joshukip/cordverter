import { cornerSheet } from './../cassini/cornersheet';
import { Injectable } from '@angular/core';
import sheetValues  from "../../assets/json/cornersheets.json";

@Injectable({
  providedIn: 'root'
})
export class CornersheetsService {

  sheetData: cornerSheet[] = sheetValues;

  constructor() { }

  getAllValues() {
    return [...this.sheetData];
  }

  // From Cassini Values to UTM
  getBox(minX: number, maxX: number, minY: number, maxY: number) {
    return {
      ...this.sheetData.find(data => {

        return minX > data.BLCX && maxX < data.BRCX && minY > data.BLCY && maxY < data.TLCY

      })
    };
  }

  // // For UTM to Cassini conversion
  getUTMBox(minX: number, maxX: number, minY: number, maxY: number) {
    return {
      ...this.sheetData.find(data => {

        return minX > data.BLUE && maxX < data.BRUE && minY > data.BLUN && maxY < data.TLUN

      })
    };
  }

  // Transform cassini Eastings to be conformal.
  performConformality(x: number) {
    let a = 20926348; // semi-major axis
    let b = 20855232.837; // semi-minor axis

    let val = x + (Math.pow(x, 3) / (6 * (a * b))) + (Math.pow(x, 5) / (24 * (Math.pow(a, 2) * Math.pow(b, 2))))

    return val;
  }

  // Transform to feet
  toFeet(val: number) {
    val = val * 3.2808; // val * 3.28084
    return val;
  }

}
