import { Component, Output, EventEmitter } from '@angular/core';

import { ParseFileService } from './../../services/parse-file.service';
import { FilestorageService } from 'src/app/services/filestorage.service';
import { Data, Router } from '@angular/router';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {

  isHovering: boolean = false;
  fileReady: boolean = false;
  files: File[] = [];
  filename: string = '';
  data: any = 'new'
  header: string[]= [];

  @Output() fileData = new EventEmitter<any>();

  constructor(
    private parseFile: ParseFileService,
    private fileStorage: FilestorageService,
    private navigator: Router
  ) { }

  toggleHover(event: boolean) {
      this.isHovering = event;
  }

  onDrop(files: FileList) {

    if (files.length > 1) {
      return;
    }
    else {
      this.filename = files[0].name
      this.fileReady = true;
      this.parseFile.csv(files[0]).then(json => {
        let data = JSON.parse(json);
        this.fileData.emit(data);
        // console.log('data'+ data);
        // this.fileStorage.file = data;
        // this.navigator.navigateByUrl('/cassini')
        // this.fileStorage.fileLoaded = true;
      });
    }
  }

  onFileChanged(e: any) {

    this.fileReady = true;
    this.filename = e.target.files[0].name
    let files = e.target.files[0];
    // console.log('data'+ this.filename);
    this.parseFile.csv(files).then(json => {
      // console.log('Json: '+ json)
      let data = JSON.parse(json);
      this.fileData.emit(data);
      // this.fileStorage.file = data;
      // this.fileStorage.fileLoaded = true;
    });

    // Clear all files ...
    e.target.value = '';
  }
}
