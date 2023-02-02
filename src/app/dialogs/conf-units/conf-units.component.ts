import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-conf-units',
  templateUrl: './conf-units.component.html',
  styleUrls: ['./conf-units.component.css']
})
export class ConfUnitsComponent implements OnInit {


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  conf_tofeet = this.fb.group({
    conf: true,
    tofeet: false,
  });


}
