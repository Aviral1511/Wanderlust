
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style : "mapbox://styles/mapbox/streets-v12",
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

console.log(listing.geometry.coordinates);
const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4> <h5>Exact location after booking</h5>`)
.setMaxWidth("300px"))
.addTo(map);

