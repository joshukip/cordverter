import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor() { }

  // Convertion of rectangular(x,y,z) to geodetic(lat,lon,height)
  recToGeodetic (x: number, y: number, z: number, a: any, f: any) {

    var d = (Math.PI / 180); // to work with degrees
    var e2 = f * (2 - f); // First eccentricity squared..
    var sec_e2 = e2 / (1 - e2); // Second eccentricity squared..
    var b = (a * (1 - f)); // semi-major axis
    var p = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); // sqrt(x squared + y squared)
    var angle = (Math.atan((z * a) / (p * b))) / d;

    var latitude_numerator = z + (sec_e2 * b * Math.pow(Math.sin(angle * d), 3)); //Latitude numerator calculation
    var latitude_denominator = p - (e2 * a * Math.pow(Math.cos(angle * d), 3)); //Longitude denominator calculation

    var lat = (Math.atan(latitude_numerator / latitude_denominator)) / d;


    // .......computing for v......
    var deonominator_for_v = Math.sqrt(1 - (e2 * Math.pow(Math.sin(lat * d), 2)));
    var v = a / deonominator_for_v;

    //..........computing for longitude...
    var long = (Math.atan(y / x) / d);
    var h = +((p / Math.cos(lat * d))-v).toFixed(2);

    //Converting latitude and longitude to dms ..degrees..minutes..seconds
    let latitude = this.ConvertDDToDMS(lat, false);
    let longitude = this.ConvertDDToDMS(long, true);

    let geoArr = {latitude,longitude,h}

    return geoArr;
  }

  // Geodetic to Rectangular
  geodeticToRec (latitude: number, longitude: number, h: string | number, a: any , f: any) {

    var d = (Math.PI / 180); // to work with degrees
    var e2 = f * (2 - f); // First eccentricity squared..
    var deonominator_for_v = Math.sqrt(1 - (e2 * Math.pow(Math.sin(latitude * d), 2)));
    var v = a / deonominator_for_v;
    var x = ((+v + +h) * Math.cos(latitude * d) * Math.cos(longitude * d)).toFixed(3);
    var y = ((+v + +h) * Math.cos(latitude * d) * Math.sin(longitude * d)).toFixed(3);
    var z = (((+v * (1 - e2)) + +h) * Math.sin(latitude * d)).toFixed(3);

    let recArr = {x,y,z}

    return recArr;
  }

  // Convert decimal degrees to degrees , minutes and seconds

  ConvertDDToDMS(deg: number, lng: boolean): string {

    var d = parseInt(deg.toString());
    var minfloat = Math.abs((deg - d) * 60);
    var m = Math.floor(minfloat);
    var secfloat = (minfloat - m) * 60;
    var s = Math.round((secfloat + Number.EPSILON) * 100) / 100
    d = Math.abs(d);

    if (s == 60) {
      m++;
      s = 0;
    }
    if (m == 60) {
      d++;
      m = 0;
    }

    let dms = {
      dir: deg < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N',
      deg: d,
      min: m,
      sec: s
    };
    return `${dms.deg}\u00B0 ${dms.min}' ${dms.sec}" ${dms.dir}`
  }


  // Convert to decimal degrees from array of degrees , minutes and seconds
  convertDMStoDD(arr: number[]) {
    let firstEl = arr[0]; // degrees
    let secEl = (arr[1] / 60); // minutes to degrees
    let thirdEl = (arr[2] / 3600); // seconds to degrees

    let calculation = (firstEl + secEl + thirdEl); // converted decimal degrees

    return calculation;
  }
}
