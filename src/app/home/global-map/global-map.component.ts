import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Subject } from 'rxjs';
import { countrydata } from '../../shared/countrydata';
import { CountryNumbersService } from '../../Services/CountryNumbersService';
import { countrymarkerdata } from '../../shared/models/countrymarkerdata';

@Component({
  selector: 'app-global-map',
  templateUrl: './global-map.component.html',
  styleUrls: ['./global-map.component.css']
})
export class GlobalMapComponent implements OnInit {

  constructor(private service : CountryNumbersService, private http : HttpClient){

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position, this) => {
    //     that = this;
    //     that.lat = position.coords.latitude;
    //     that.lng =  position.coords.longitude;
     

    //   }, function() {
       
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
     
    // }

  }
  @ViewChild('mapContainer') gmap: ElementRef;
  map: google.maps.Map;
  lat = 40;
  lng = -4;

  markers = [];
  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 3,
  };

  marker = new google.maps.Marker({
    //position: this.coordinates,
    map: this.map,
  });

  

  
  ngOnInit() {

    this.service.GetCurrentLocationInfo().subscribe((data : Params) => {

      const currentIP = data.ip
      
          this.http.get("https://ipapi.co/"+currentIP+"/json/'",{ headers : {'Access-Control-Allow-Origin' : '*'}})
            .subscribe((data : Params) => {

              this.lat = data.latitude;
              this.lng = data.longitude;

              console.log(this.lat);
              console.log(this.lng);
            });
  
      }); 

   
      this.map = new google.maps.Map(this.gmap.nativeElement, 
        this.mapOptions);
        this.marker.setMap(this.map);
  
      this.service.GetMarkerInfo(this.map)
  

    this.service.markersChanged.subscribe((markerInfo : countrymarkerdata) => {
      
       //Creating a new marker object
      const marker = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center:{lat : +markerInfo.Lat, lng : +markerInfo.Lon},
        radius: Math.sqrt(markerInfo.Cases) * 5000
      });



      //creating a new info window with markers info
      const countryproviencinfo = markerInfo.Province ? markerInfo.Province : markerInfo.Country;
      const infoWindow = new google.maps.InfoWindow({
        content: '<div><h4>'+  countryproviencinfo +'<h4> <hr /><h5>Cases : '+ markerInfo.Cases+'</h5></div>'
      });

      //Add click event to open info window on marker
      marker.addListener("click", () => {

       
        this.map.setZoom(4);
        this.map.setCenter(marker.getCenter());

        infoWindow.setPosition(marker.getCenter());
        infoWindow.open(this.map);
      });

      //Adding marker to google map
      marker.setMap(this.map);
    });
   }



}