import { NgModule } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatMenuModule} from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

const MatComponents = [
  MatToolbarModule,
  MatTabsModule,
  MatButtonModule,
  MatTableModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatRadioModule,
  MatMenuModule,
  DragDropModule,
  MatListModule,
  MatDividerModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule,
  MatCheckboxModule
]

@NgModule({
  imports: [MatComponents],
  exports: [MatComponents]
})
export class MaterialModule { }
