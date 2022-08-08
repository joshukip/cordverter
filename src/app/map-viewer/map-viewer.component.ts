import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {DragBox, Draw, Modify, Snap} from 'ol/interaction';
import OSM from 'ol/source/OSM';
// import {Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer,} from 'ol/layer';
import Vector from "ol/layer/Vector"
import {get} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select'; // For select
import {altKeyOnly, click, platformModifierKeyOnly, pointerMove} from 'ol/events/condition';

import GeoJSON from 'ol/format/GeoJSON';

import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';


@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit {

  map: any;

  bmapvisible = false;
  edit =  false;
  mousehover = false;

  raster: any;
  vector: any;
  source:any;
  draw: any;
  snap: any;
  selectedFeatures: any;

  constructor() {

    this.source = new VectorSource({ // VectorSource({
      wrapX: false
    });

    this.raster = new TileLayer({ // TileLayer({
      source: new OSM(),
    });

    this.vector = new Vector({ // VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      })
    });


  }

  ngOnInit(): void {

    this.map = new Map({

      layers: [this.raster, this.vector],
      target: 'map',
      view: new View({
        center: [36.8, -1],
        zoom: 4,
      }),
    });

  }

  toggleEdits() {
    if (!this.edit) {
      this.edit = true;
    }
    else{
      this.edit = false;
    }

    this.map.removeInteraction(this.draw);
  }

  addGeometry(value: any) {

    if (value !== 'None') {
      this.snap = new Snap({
        source: this.source
      });
      this.draw = new Draw({
        source: this.source,
        type: value,
      });
      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);
    }
  }

  changeGeometry(value: string) {
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.addGeometry(value);
  }

  select() {
    this.map.removeInteraction(this.draw);
    const selectPointerMove = new Select({
      condition: click,
    });

    this.map.addInteraction(selectPointerMove);
    this. selectedFeatures = selectPointerMove.getFeatures();
  }

  selectMultiple() {
    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    });
    this.map.addInteraction(dragBox);
  }

  toggleBasemap() {
    if(!this.bmapvisible){
      this.bmapvisible = true;
      this.raster.setVisible(false);

    } else {
      this.bmapvisible = false;
      this.raster.setVisible(true);
    }

  }

  getMousePosition() {
    if(!this.mousehover) {
      this.mousehover = true;

    } else {
      this.mousehover = false;

    }

  }

  deleteSelected() {
    this.selectedFeatures.forEach((feature: any) => {
      this.vector.getSource().removeFeature(feature);
    });
  }

  clearAll() {
    if(confirm('All features will be cleared!!')) this.vector.getSource().clear();
  }

  saveFeatures() {
    const format = new GeoJSON({featureProjection: 'EPSG:4326'});
    console.log(format.writeFeatures(this.vector));
  }

}


