mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",//style is defined satellite-streets-v12,dark-v11
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
console.log(listing.geometry.coordinates)

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4> ${listing.title}</h4><p>Exact location after booking!<p>`))
    .addTo(map);

