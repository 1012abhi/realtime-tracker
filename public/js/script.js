const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sent-location", {latitude, longitude});
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
    )
}

const map = L.map("map").setView([0,0], 16)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    // subdomains: ['a', 'b', 'c']
}).addTo(map);

const markers = {}

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude])

    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude])
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})