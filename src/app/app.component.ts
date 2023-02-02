import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cordverter.io';
  year = this.getCurrentYear();

  getCurrentYear() {
    const date = new Date;
    const year = date.getFullYear();

    return year;
  }
}
