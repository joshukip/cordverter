import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilestorageService {

  public file = null;
  public fileLoaded = false;

  constructor() {

   }

   // A csv template of converting x,y,z(rec) coordinates to latitude, longitude and height(geo)
   rectoGeoCSV() {
    const rows = [
      ["X", "Y", "Z"],
    ];

    let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
   }

   // A csv template of converting latitude, longitude and height(geo) coordinates to x,y,z(rec)
   geotoRecCSV() {

   }

   // A CSV template for converting CASSINI to UTM.
   cassinitoUTMCSV() {

   }
}
