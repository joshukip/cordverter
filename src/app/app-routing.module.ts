import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { AppComponent } from "./app.component";
import { CassiniComponent } from "./cassini/cassini.component";
import { ConvertComponent } from "./convert/convert.component";
import { MapViewerComponent } from "./map-viewer/map-viewer.component";
import { ProjectionsComponent } from "./projections/projections.component";

const routes: Routes = [
  {path: 'cassini', component: CassiniComponent},
  {path: 'map-viewer', component: MapViewerComponent},
  {path: 'convert', component: ConvertComponent},
  {path: 'about', component: AboutComponent},
  {path: '', redirectTo: '/convert', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [CassiniComponent, MapViewerComponent, ProjectionsComponent, ConvertComponent]
