import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilestorageService {

  public file = null;
  public fileLoaded = false;

  constructor() { }
}
