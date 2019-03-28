
var cultivos = [];
var seleccionado;
axios.get('http://localhost:8080/minAgricultura/convertcsv.json')
  .then(function (response) {
    cultivos = response.data;
    var select = document.getElementById('filter');
    for (var i = 0; i < cultivos.length; i++) {
      var opt = document.createElement('option');
      opt.value = cultivos[i].cultivo;
      opt.innerHTML = cultivos[i].cultivo;
      select.appendChild(opt);
    }
    });

var map;
var opLayer;

var layerDefs = [];
var layerD;

function cambiar(){
  if (map && timeS) {
    timeS.destroy();
      map.destroy();
  }
    require([
      "esri/map",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/TimeExtent",
      "esri/dijit/TimeSlider",
      "dojo/_base/array",
      "esri/layers/ImageParameters",
      "esri/dijit/Legend",
      "dojo/dom",
      "dojo/domReady!"
    ], function (
      Map,
      ArcGISDynamicMapServiceLayer,
      TimeExtent,
      TimeSlider,
      arrayUtils,
      ImageParameters,
      Legend,
      dom
    ) {
      map = new Map("mapDiv", {
        basemap: "topo-vector",
        center: [-73, 4],
        zoom: 4
      });
    var imageParameters = new ImageParameters();

       seleccionado = document.getElementById('filter').value;
       layerD = "cultivo = " + "'"+seleccionado+"'";
       console.log(layerD)

      layerDefs[0] = layerD;
      console.log(layerDefs[0]);
       imageParameters.layerDefinitions = layerDefs;
       imageParameters.layerIds = [0];
       imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
       imageParameters.transparent = true;



      opLayer = new ArcGISDynamicMapServiceLayer("//geoapps.esri.co/arcgis/rest/services/Mapas_De_La_Semana/HistoricoCultivosF/MapServer",
      {"imageParameters": imageParameters});


      //apply a definition expression so only some features are shown


      //add the gas fields layer to the map
      map.addLayers([opLayer]);
      map.on("layers-add-result", function (evt) {
       var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
         return {layer:layer.layer, title:"Producción en Toneladas"};
       });
       if (layerInfo.length > 0) {
         var legendDijit = new Legend({
           map: map,
           layerInfos: layerInfo
         }, "legendDiv");
         legendDijit.startup();
       }
     });

      map.on("layers-add-result", initSlider);
        var timeS;

      function initSlider() {

       timeS = new TimeSlider({
          style: "width: 100%;"
        }, dom.byId("timeSliderDiv"));
        var timeSlider = timeS;
        map.setTimeSlider(timeSlider);

        var timeExtent = new TimeExtent();
        timeExtent.startTime = new Date("1/1/1977 UTC");
        timeExtent.endTime = new Date("12/31/2017 UTC");
        timeSlider.setThumbCount(2);
        timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, "esriTimeUnitsYears");
        timeSlider.setThumbIndexes([0,1]);
        timeSlider.setThumbMovingRate(1000);
        timeSlider.startup();

        //add labels for every other time stop
        var labels = arrayUtils.map(timeSlider.timeStops, function(timeStop, i) {
          if ( i % 2 === 0 ) {
            return timeStop.getUTCFullYear();
          } else {
            return "";
          }
        });

        timeSlider.setLabels(labels);

        timeSlider.on("time-extent-change", function(evt) {
          var startValString = evt.startTime.getUTCFullYear();
          var endValString = evt.endTime.getUTCFullYear();
          dom.byId("daterange").innerHTML = "<i>" + startValString + " and " + endValString  + "<\/i>";
        });
      }


    });


}
