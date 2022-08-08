import { Component, OnInit } from '@angular/core';
import { FilestorageService } from '../services/filestorage.service';

@Component({
  selector: 'app-cassini',
  templateUrl: './cassini.component.html',
  styleUrls: ['./cassini.component.css']
})
export class CassiniComponent implements OnInit {

  constructor(
    private fileStorage: FilestorageService
  ) { }

  ngOnInit(): void {
    console.log(this.fileStorage.file);
  }

}
