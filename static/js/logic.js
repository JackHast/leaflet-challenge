
// API used 
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating map
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
// Adding tilelayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Loading data for past week of Earthquakes from API
d3.json(url).then(function(data){
    let Data = data.features;
    // Looping through each earthquake
    for (let i=0;i<Data.length;i++){
        // Getting relevant data for earthquake
        let earthquake=Data[i];
        let size = earthquake.properties.mag;
        let location = earthquake.properties.place;
        let depth = earthquake.geometry.coordinates[2];
        let coordinates = [earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]];
        let colour = ""
        // Determining colour based on depth of earthquake
        if (depth>=-10 && depth<10){
           colour = "#e8fa5bff";
        }
        else if (depth>=10 && depth<30){
          colour = "#f9b641ff";
        }
        else if (depth>=30 && depth<50){
          colour = "#de7065ff";
        }
        else if (depth>=50 && depth<70){
          colour = "#90548bff";
        }
        else if (depth>=70 && depth<90){
          colour = "#403891ff";
        }
        else if (depth>=90){
          colour = "#042333ff";
          
        }
        // Adding circle at location of earthquake
        L.circle(coordinates, {
          color: colour,
          fillColor: colour,
          fillOpacity: 1,
          radius: size*50000 // radius of circle calculated from size (magnitude) of earthquake
          // Adding Popup with location, magnitude and depth
        }).bindPopup("<h3>Location: " +location + "<h3><h3>Magnitude: " + size + "<h3><h3>Depth : " + depth +" km" + "</h3>").addTo(myMap);
    }
  }
)


// Adding legend to map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  let colours = ["#e8fa5bff","#f9b641ff","#de7065ff","#90548bff","#403891ff","#042333ff"]
  let depths = ["-10-10 km","10-30 km","30-50 km","50-70 km","70-90 km","90+ km"]
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colours[i] + '"></i> ' + depths[i] + '<br>';
}
  return div;
};

legend.addTo(myMap);