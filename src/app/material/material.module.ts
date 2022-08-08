import { NgModule } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';

const MatComponents = [
  MatToolbarModule,
  MatTabsModule,
  MatButtonModule,
  MatTableModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatRadioModule

]
@NgModule({
  imports: [MatComponents],
  exports: [MatComponents]
})
export class MaterialModule { }
