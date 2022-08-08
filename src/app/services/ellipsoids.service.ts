import { Ellipsoid } from './../ellipsoid';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EllipsoidsService {

  ellipsoids: Ellipsoid[] = [
    {
      name: 'Airy (1830)',
      value: '1',
      a: 6377563.396,
      f: 1 / 299.324964
    },
    {
      name: 'Everest (1830)',
      value: '2',
      a: 6377276.345,
      f: 1 / 300.8017
    },
    {
      name: 'Bessel (1841)',
      value: '3',
      a: 6377397.155,
      f: 1 / 299.152813
    },
    {
      name: 'Clarke (1866)',
      value: '4',
      a: 6378206.4,
      f: 1 / 294.978698
    },
    {
      name: 'Clarke (1880)',
      value: '5',
      a: 6378249, // or 6378249.145
      f: 1 / 293.465
    },
    {
      name: 'Modified Clarke (1880)',
      value: '6',
      a: 6378249.145,
      f: 1 / 293.4663
    },
    {
      name: 'International (1924)',
      value: '7',
      a: 6378388,
      f: 1 / 297
    },
    {
      name: 'Krassovski (1940)',
      value: '8',
      a: 6378245,
      f: 1 / 298.3
    },
    {
      name: 'Mercury (1960)',
      value: '9',
      a: 6378166,
      f: 1 / 298.3
    },
    {
      name: 'Modified Mercury (1968)',
      value: '10',
      a: 6378150,
      f: 1 / 298.3
    },
    {
      name: 'Geodetic Reference System (1967), GRS67',
      value: '11',
      a: 6378160,
      f: 1 / 298.2471674273
    },
    {
      name: 'Geodetic Reference System (1980), GRS80',
      value: '12',
      a: 6378137,
      f: 1 / 298.257222101
    },
    {
      name: 'World Geodetic System (1966), WGS66',
      value: '13',
      a: 6378145,
      f: 1 / 298.25
    },
    {
      name: 'World Geodetic System (1972), WGS72',
      value: '14',
      a: 6378135,
      f: 1 / 298.26
    },
    {
      name: 'World Geodetic System (1984), WGS84',
      value: '15',
      a: 6378137,
      f: 1 / 298.257
    },
    {
      name: 'Australian National',
      value: '16',
      a: 6378160,
      f: 1 / 298.25
    },
    {
      name: 'South American (1969)',
      value: '17',
      a: 6378160,
      f: 1 / 298.25
    },
    {
      name: 'TOPEX/Poseidon (1992) (IERS recom.)^2',
      value: '18',
      a: 6378136.3,
      f: 1 / 298.257
    },
  ]

  constructor() { }

  getAllEllipsoids() {
    return [...this.ellipsoids];
  }

  getEllipsoid(ellValue: string) {
    return {
      ...this.ellipsoids.find(ellipsoid => {
        return ellipsoid.value === ellValue;
      })
    };
  }

}

