import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ConvertComponent } from './convert/convert.component';
import { DropzoneDirective } from './dragndrop/dropzone.directive';
import { UploaderComponent } from './dragndrop/uploader/uploader.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './about/about.component';
import { ConfUnitsComponent } from './dialogs/conf-units/conf-units.component';
import { AddpointUploaderComponent } from './cassini/addpoint-uploader/addpoint-uploader.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ConvertComponent,
    DropzoneDirective,
    UploaderComponent,
    AboutComponent,
    ConfUnitsComponent,
    AddpointUploaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    NgbModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
