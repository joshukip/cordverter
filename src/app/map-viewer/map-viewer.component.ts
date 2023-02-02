import { FormGroup } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';
import {DragBox, Draw, Modify, Snap} from 'ol/interaction';
import DragAndDrop from 'ol/interaction/DragAndDrop';
// import {GeoJSON, KML} from 'ol/format';
// import GeoJSON from 'ol/format/GeoJSON';
// import {Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer,} from 'ol/layer';
import Vector from "ol/layer/Vector";
import VectorLayer from 'ol/layer/Vector';
import {get} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select'; // For select
import {altKeyOnly, click, platformModifierKeyOnly, pointerMove, shiftKeyOnly} from 'ol/events/condition';

import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';

import MousePosition from 'ol/control/MousePosition';
import {Coordinate, createStringXY, format} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import {transform} from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Geometry from 'ol/geom/Geometry';




@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit {

  map: any;

  showPanel =  true;
  expandpanel = false;
  bmapvisible = true;
  edit =  false;
  multipleSelection = false;
  singleSelection = false;
  pickPoint = false;
  geoType = '';

  raster: any;
  vector: any;
  source:any;
  draw: any;
  snap: any;
  mousePositionControl: any;
  selectedFeatures: any;

  top: any;
  left: any;
  expand: any;

  pickedCoordinates: any;

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

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: 'mousePos',
      undefinedHTML: '&nbsp;'
    });

    //this.pickedPointDetails();
    // this.addOnDrop;

  }

  ngOnInit(): void {

    this.map = new Map({

      layers: [this.raster, this.vector],
      target: 'map',
      controls: defaultControls({
        attributionOptions: {
            collapsible: true
        },
    }).extend([this.mousePositionControl]),
      view: new View({
        center: [4370286.6875517545, 12958.696726873408],
        zoom: 6,
      }),

    });

    this.addOnDrop();
  }

  toggleLayerPanel() {
    this.showPanel = !this.showPanel;
  }

  minimizePanel() {
    if(this.expandpanel) {
      this.expandpanel = false;
    }
  }

  maximizePanel() {
    if(this.expandpanel == false) {
      this.expandpanel = true;
    }
  }

  closePanel() {
    if(this.showPanel) {
      this.showPanel = false;
    }
  }

  toggleEdits() {

    this.edit = !this.edit;
    this.map.removeInteraction(this.draw);

    // Avoid picking points while editing.
    if (this.pickPoint) {
      this.pickPoint= false;
    }

    // Remove active draw feature
    this.geoType = '';

  }

  // Add drag and drop functionality
  addOnDrop() {
    /*const map = this.map;
    const dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [
        GPX,
        GeoJSON,
        IGC,
        // use constructed format to set options
        new KML({extractStyles: extractStyles.checked}),
        TopoJSON,
      ],
    });
    if (dragAndDropInteraction) {
      map.removeInteraction(dragAndDropInteraction);
    }
    dragAndDropInteraction.on('addfeatures', function (event) {
      const vectorSource = new VectorSource({
        features: event.features,
      });
      map.addLayer(
        new VectorLayer({
          source: vectorSource,
        })
      );
      map.getView().fit(vectorSource.getExtent());
    });

    map.addInteraction(dragAndDropInteraction);
    */
    const source = new VectorSource();

    const layer = new VectorLayer({
      source: source
    })


    this.map.addInteraction(new DragAndDrop({
      source: source,
      formatConstructors: [GeoJSON]
    }))

    this.map.addLayer(layer);
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
    this.geoType = value;
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.addGeometry(value);
  }

  // Single selection.
  select() {

    // this.map.removeInteraction()
    this.singleSelection = !this.singleSelection;

    if(this.edit == true){
      this.edit = false;
    }

    // Avoid picking points while selecting.
    if (this.pickPoint == true) {
      this.pickPoint= false;
      this.geoType = '';
    }

    let selectPointerMove = new Select({
      condition: click,
    });

    this.map.removeInteraction(this.draw);

    this.map.addInteraction(selectPointerMove);
    this.selectedFeatures = selectPointerMove.getFeatures();


  };

  // Multiple selection with drag box element.
  selectMultiple() {

    this.multipleSelection = !this.multipleSelection;

    if(this.multipleSelection == true){
      const select = new Select();
      this.map.addInteraction(select);

      this.selectedFeatures = select.getFeatures();
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly, // ctrl key
      });

      this.map.addInteraction(dragBox);



      dragBox.on('boxend', (e) => {
        // features that intersect the box are added to the collection of
        // selected features, and their names are displayed in the "info"
        // div
        var extent = dragBox.getGeometry().getExtent();
        this.vector.getSource().forEachFeatureIntersectingExtent(extent, (feature: any) =>{
          //console.log(feature);
          this.selectedFeatures.push(feature);
        });
      });

      dragBox.on('boxstart', (e) => {
        if(this.selectedFeatures){
          this.selectedFeatures.clear();
        }
      });
    }
  }

  toggleBasemap() {
    if(!this.bmapvisible){
      this.bmapvisible = true;
      this.raster.setVisible(true);

    } else {
      this.bmapvisible = false;
      this.raster.setVisible(false);
    }

  }

  // @HostListener('document:mousemove', ['$event'])
  // onMousemove($event: any) {
  //   console.log($event);
  //   // console.log($event.pageX);
  //   this.top=($event.pageY - 580)+ "px";
  //   this.left= ($event.pageX  - 1010)+ "px";
  // }

  pickPosition() {
    // if (this.pickPoint === false) {
    //   this.pickPoint = true;
    // } else {
    //   this.pickPoint = false;
    // }

    this.pickPoint =! this.pickPoint;
    // let cArr: Coordinate[][] = [];
    let cArr: number[][]  = [];

    if(this.edit){
      this.edit = false;
      this.map.removeInteraction(this.draw);
    }

    this.map.on('click', (evt: any) =>{
      let coordinate;
      // Get the pointer coordinate
      coordinate = transform(evt.coordinate, 'EPSG:3857', 'EPSG:3857');
      //console.log(coordinate)

      var iconFeature = new Feature({
        geometry: new Point(coordinate)
      });

      var style = new Style({
        image: new Icon({
          opacity: 1,
          src: '../../assets/images/pin.svg',
          scale: 0.05
        })
      });


      let outCoord = coordinate.map(x => {
        return +x.toFixed(4)
      });
      // console.log(coordinate);
      let singleArr = outCoord;
      cArr.push(singleArr);

      var layer = new Vector({
        style: style,
        source: new VectorSource({
          features: [iconFeature]
        })
      })

      if(this.pickPoint === true) {
        this.map.addLayer(layer);
      }
      // Change cursor on icon hover

      const map = this.map;
      map.on('pointermove', function (e:any) {
        const hit = map.hasFeatureAtPixel(e.pixel);
        console.log(hit);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });


    })

    // console.log(cArr)
    this.pickedCoordinates = cArr;


    /*this.mousehover = !this.mousehover;

    if (this.mousehover) {
      this.map.removeInteraction(); //to be revisited.
      let coordinate;
      this.map.on('click', function(evt: any){
        // Get the pointer coordinate
        coordinate = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        console.log(coordinate)
      })
    }
    */
  }

  // Delete Picked Point
  removePickedPoint(i: any) {
    let point = this.pickedCoordinates.splice(i, 1);
    console.log(point);
    const map = this.map;
    const hit = map.hasFeatureAtPixel(point[0]);
    console.log(hit);
    //   map.on('click', function (e:any) {
    //     const hit = map.hasFeatureAtPixel(e.pixel);
    //     console.log(hit);
    //     map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    //   });
  }

  // Reset the view to original extent
  resetView() {
    this.map.getView().animate({
      center: [4370286.6875517545, 12958.696726873408],
      zoom: 6,
      duration: 1500
    })

    // console.log(this.map.getView().getCenter())
  }

  // show picked coordinate details.
  pickedPointDetails() {
    if(this.map){
      const map = this.map;
      map.on('click', function (e:any) {
        const feauture = map.forEachFeatureAtPixel(e.pixel, (feature: any) =>{
          return feature;
        });
        console.log(feauture);
      });
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

  download(data: any, filename: string) {
    var blob = new Blob([data], {type: 'text/plain'});

    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }


  saveFeatures(ext: string) {
    const GeoJsonFormat = new GeoJSON();
    const KMLFormat = new KML();
    const features = this.source.getFeatures();

    // features.forEach((feature:any)=> {
    //   json = format.writeFeature(feature);
    //   console.log(json)
    // });

    if (ext == 'kml'){
      const kml = KMLFormat.writeFeatures(features, {featureProjection: 'EPSG:3857'}); //GoogleEarth version
      this.download(kml, 'features.kml');
    }
    if (ext === 'json') {
      const json = GeoJsonFormat.writeFeatures(features);
      this.download(json, 'features.json');
    }

  }

}


