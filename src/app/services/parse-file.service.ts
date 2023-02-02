import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ParseFileService {

  public headers: string[] = [];

  constructor() { }

  csv (files: File) : Promise<string> {

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onerror = (e: any) => {
          reject(fileReader.error);
          console.log(e);
      }

      fileReader.onload = (e: any) => {
          var json = this.parseCSV(e.target.result);
          // console.log(json);
          resolve(json);
      }

      fileReader.readAsText(files);
    })
  }

  /*parseCSV (csv: string) {
    const lines = csv.split("\r\n");
    const headers = lines[0].split(',');
    // console.log(lines)
    this.headers = headers;
    let results = []


    for (let x = 1; x < lines.length-1; x++) {
        let obj: any = {};
        const currentLine = lines[x].split(',').map((s: string) => s.trim());

        for (let y = 0; y < headers.length; y++) {
            obj[headers[y]] = currentLine[y];
        }

        results.push(obj);
    }

    // console.log(results)
    return JSON.stringify(results, null, '\t');
    // return results;

  }*/

  parseCSV(csv : string) {
    const lines = csv.split("\r");
    const headers = lines[0].split(',');
    let results = [];

    for (let x = 1; x < lines.length - 1; x++) {
        let obj: any = {};
        const currentLine = lines[x].split(',').map(s => s.trim());

        for (let y = 0; y < headers.length; y++) {
            obj[headers[y]] = currentLine[y];
        }

        results.push(obj);
    }

    return JSON.stringify(results, null, "\t");
  }

}








