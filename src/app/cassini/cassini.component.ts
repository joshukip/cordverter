import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { matrix, multiply, transpose, inv } from "mathjs";

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfUnitsComponent } from '../dialogs/conf-units/conf-units.component';
import { MatTabChangeEvent } from '@angular/material/tabs';



@Component({
  selector: 'app-cassini',
  templateUrl: './cassini.component.html',
  styleUrls: ['./cassini.component.css']
})
export class CassiniComponent implements OnInit {

  inputform: FormGroup;
  common_points = [1,2,3,4,5,6,7];
  csvData: any;
  csvLoaded =  false;
  result: any;
  conf: any;
  tofeet: any;

  public index: number = 0;
  // @Output() selectedTabChange: EventEmitter<MatTabChangeEvent> = new EventEmitter();

  constructor(
    // public dialogRef: MatDialogRef<ConfUnitsComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private _matdialogue: MatDialog
  ) {

    this.inputform = this.fb.group ({
        CassiniX_1: [-182848.4, Validators.required],
        CassiniY_1: [-54102.1, Validators.required],
        UTME_1: [221784.7, Validators.required],
        UTMN_1: [9861717.5, Validators.required],
        CassiniX_2: [-128079.9, Validators.required],
        CassiniY_2: [-54093.1, Validators.required],
        UTME_2: [238487.3, Validators.required],
        UTMN_2: [9861732.9, Validators.required],
        CassiniX_3: [-91567.5, Validators.required],
        CassiniY_3: [-54089, Validators.required],
        UTME_3: [249621.4, Validators.required],
        UTMN_3: [9861742.7, Validators.required],
        CassiniX_4: [-182828.2, Validators.required],
        CassiniY_4: [-144786.5, Validators.required],
        UTME_4: [221813.7, Validators.required],
        UTMN_4: [9834060.9, Validators.required],
        CassiniX_5: [-128066.6, Validators.required],
        CassiniY_5: [-144775.6, Validators.required],
        UTME_5: [238514.6, Validators.required],
        UTMN_5: [9834079.4, Validators.required],
        CassiniX_6: [-91559.2, Validators.required],
        CassiniY_6: [-144770.8, Validators.required],
        UTME_6: [249647.4, Validators.required],
        UTMN_6: [9834091.1, Validators.required],
        CassiniX_7: [-128075, Validators.required],
        CassiniY_7: [-90366.3, Validators.required],
        UTME_7: [238497.6, Validators.required],
        UTMN_7: [9850671.5, Validators.required],
    })


  }

  ngOnInit(): void {

  }

  receivePointData(event: any) {
    this.csvData = [];
    if(event) {
      this.csvLoaded = true;
      this.csvData = event;
    }
  }

  TabSelectedChange(changeEvent: MatTabChangeEvent) {
    this.index = changeEvent.index;
  }

  generateParameters(conf: boolean, tofeet: boolean) {
    // UTM values E and N
    let  uE_1 = this.inputform.value.UTME_1; let  uN_1 = this.inputform.value.UTMN_1;
    let  uE_2 = this.inputform.value.UTME_2; let  uN_2 = this.inputform.value.UTMN_2;
    let  uE_3 = this.inputform.value.UTME_3; let  uN_3 = this.inputform.value.UTMN_3;
    let  uE_4 = this.inputform.value.UTME_4; let  uN_4 = this.inputform.value.UTMN_4;
    let  uE_5 = this.inputform.value.UTME_5; let  uN_5 = this.inputform.value.UTMN_5;
    let  uE_6 = this.inputform.value.UTME_6; let  uN_6 = this.inputform.value.UTMN_6;
    let  uE_7 = this.inputform.value.UTME_7; let  uN_7 = this.inputform.value.UTMN_7;
    // Cassini values X and Y
    let  cX_1 = this.inputform.value.CassiniX_1; let  cY_1 = this.inputform.value.CassiniY_1;
    let  cX_2 = this.inputform.value.CassiniX_2; let  cY_2 = this.inputform.value.CassiniY_2;
    let  cX_3 = this.inputform.value.CassiniX_3; let  cY_3 = this.inputform.value.CassiniY_3;
    let  cX_4 = this.inputform.value.CassiniX_4; let  cY_4 = this.inputform.value.CassiniY_4;
    let  cX_5 = this.inputform.value.CassiniX_5; let  cY_5 = this.inputform.value.CassiniY_5;
    let  cX_6 = this.inputform.value.CassiniX_6; let  cY_6 = this.inputform.value.CassiniY_6;
    let  cX_7 = this.inputform.value.CassiniX_7; let  cY_7 = this.inputform.value.CassiniY_7;


    // Convert Cassini coordinates to feet
    if (tofeet == true) {
      cX_1 = this.toFeet(cX_1); cY_1 = this.toFeet(cY_1);
      cX_2 = this.toFeet(cX_2); cY_2 = this.toFeet(cY_2)
      cX_3 = this.toFeet(cX_3); cY_3 = this.toFeet(cY_3)
      cX_4 = this.toFeet(cX_4); cY_4 = this.toFeet(cY_4)
      cX_5 = this.toFeet(cX_5); cY_5 = this.toFeet(cY_5)
      cX_6 = this.toFeet(cX_6); cY_6 = this.toFeet(cY_6)
      cX_7 = this.toFeet(cX_7); cY_7 = this.toFeet(cY_7)
    }

    // Conformality in Eastings
    if (conf == true){
      cX_1 = this.performConformality(cX_1);
      cX_2 = this.performConformality(cX_2);
      cX_3 = this.performConformality(cX_3);
      cX_4 = this.performConformality(cX_4);
      cX_5 = this.performConformality(cX_5);
      cX_6 = this.performConformality(cX_6);
      cX_7 = this.performConformality(cX_7);
    };


    // Matrix I
    const I =
      [[uE_1],[uE_2],
      [uE_3],[uE_4],
      [uE_5],[uE_6],
      [uE_7],[uN_1],
      [uN_2],[uN_3],
      [uN_4],[uN_5],
      [uN_6],[uN_7]]

    // Main matrix A
    const A =
    [
    [cX_1, cY_1, (cX_1*cX_1), (cX_1*cY_1), (cY_1*cY_1), 0, 0, 0, 0, 0, 1, 0],
    [cX_2, cY_2, (cX_2*cX_2), (cX_2*cY_2), (cY_2*cY_2), 0, 0, 0, 0, 0, 1, 0],
    [cX_3, cY_3, (cX_3*cX_3), (cX_3*cY_3), (cY_3*cY_3), 0, 0, 0, 0, 0, 1, 0],
    [cX_4, cY_4, (cX_4*cX_4), (cX_4*cY_4), (cY_4*cY_4), 0, 0, 0, 0, 0, 1, 0],
    [cX_5, cY_5, (cX_5*cX_5), (cX_5*cY_5), (cY_5*cY_5), 0, 0, 0, 0, 0, 1, 0],
    [cX_6, cY_6, (cX_6*cX_6), (cX_6*cY_6), (cY_6*cY_6), 0, 0, 0, 0, 0, 1, 0],
    [cX_7, cY_7, (cX_7*cX_7), (cX_7*cY_7), (cY_7*cY_7), 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, cX_1, cY_1, (cX_1*cX_1), (cX_1*cY_1), (cY_1*cY_1), 0, 1],
    [0, 0, 0, 0, 0, cX_2, cY_2, (cX_2*cX_2), (cX_2*cY_2), (cY_2*cY_2), 0, 1],
    [0, 0, 0, 0, 0, cX_3, cY_3, (cX_3*cX_3), (cX_3*cY_3), (cY_3*cY_3), 0, 1],
    [0, 0, 0, 0, 0, cX_4, cY_4, (cX_4*cX_4), (cX_4*cY_4), (cY_4*cY_4), 0, 1],
    [0, 0, 0, 0, 0, cX_5, cY_5, (cX_5*cX_5), (cX_5*cY_5), (cY_5*cY_5), 0, 1],
    [0, 0, 0, 0, 0, cX_6, cY_6, (cX_6*cX_6), (cX_6*cY_6), (cY_6*cY_6), 0, 1],
    [0, 0, 0, 0, 0, cX_7, cY_7, (cX_7*cX_7), (cX_7*cY_7), (cY_7*cY_7), 0, 1],

    ]

    // Transpose(A)I
    let matA = matrix(A); // Transform into matrix from array
    let matI = matrix(I);

    let tr_matA = transpose(matA); // Transpose of matrix A
    let tr_matA_matI = multiply(tr_matA, matI) // transpose(A)I

    // Transpose(A)A
    let tr_matA_matA = multiply(tr_matA, matA) // transpose(A)A

    // Inverse of Transpose(A)A
    let invOftr_matA_matA = inv(tr_matA_matA);

    // Final result
    let result = multiply(invOftr_matA_matA, tr_matA_matI)

    // console.log(result.get([1,0]));
    let A1 = result.get([0,0]); let A2 = result.get([1,0]); let A3 = result.get([2,0]);
    let A4 = result.get([3,0]); let A5 = result.get([4,0]); let B1 = result.get([5,0]);
    let B2 = result.get([6,0]); let B3 = result.get([7,0]); let B4 = result.get([8,0]);
    let B5 = result.get([9,0]); let A0 = result.get([10,0]); let B0 = result.get([11,0]);

    let param_arr = [A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, A0, B0];


    console.log(param_arr);

    return param_arr;
  }

  // Transform cassini Eastings to be conformal.
  performConformality(x: number) {
    let a = 20926348; // semi-major axis
    let b = 20855232.837; // semi-minor axis

    let val = x + (Math.pow(x, 3) / (6 * (a * b))) + (Math.pow(x, 5) / (24 * (Math.pow(a, 2) * Math.pow(b, 2))))

    return val;
  }

  toFeet(val: number) {
    val = val * 3.28084;
    return val;
  }

  // Perform transformation
  performTransformation() {

  }

  // prompt dialog of conformality and change cassini feet to meters before generating parameters.
  promptDialog() {
    const dialogRef = this._matdialogue.open(ConfUnitsComponent, );


    dialogRef.afterClosed().subscribe(result => {
      this.result = result;

      this.generateParameters(this.result.conf, this.result.tofeet);
    });
  }
}
