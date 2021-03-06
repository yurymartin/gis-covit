import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
// import { Icon } from "leaflet";
import Axios from "axios";
import io from "socket.io-client";
import Spinner from "../Organisms/Spinner";
import Pointer from "../Organisms/Pointer";

// const socket = io("https://gis-covit.herokuapp.com/",{
//   forceNew: true
// });

const socket = io("http://localhost:3001/", {
  forceNew: true,
});

// const icon = new Icon({
//   iconUrl: "/alfiler.svg",
//   iconSize: [40, 40],
// });

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

const Mapa = () => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [estado, setEstado] = useState("");
  const [response, setResponse] = useState([]);
  // const [response, setResponse] = useState({});

  // const Nuevo = () => {
  //   socket.on("newUserCoordinates", (data) => {
  //     setResponse(data);
  //   });
  //   return (
  //     <Marker position={[response.lat, response.lng]} icon={icon}>
  //       <Popup>
  //         {`Temperatura: ${response.temperatura} °C`} <br />
  //         {`Persona: ${response.displayName}`} <br />
  //         {`Estado: ${response.estado}`} <br />
  //       </Popup>
  //     </Marker>
  //   );
  // };

  useEffect(() => {
    Axios.get(
      `${
        process.env.REACT_APP_URL_API
      }/ultimatemperatureUser/${localStorage.getItem("_id")}`,
      config
    ).then((data) => {
      setTemperature(data.data.temperature.temperatura);
      setEstado(data.data.temperature.state);
    });
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      socket.emit("userCoordinates", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        estado: estado,
        displayName: localStorage.getItem("displayName"),
        temperatura: temperature,
      });
    });
    socket.on("newUserCoordinates", (data) => {
      setResponse(data);
      console.log(response);
    });
  }, [lng, lat, estado, temperature, response]);

  return (
    <>
      {lat === 0 && lng === 0 ? (
        <Spinner />
      ) : (
        <>
          <Map center={[lat, lng]} zoom={100}>
            <TileLayer
              url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />{" "}
            */}
            {/* <Marker position={[lat, lng]} icon={icon}>
              <Popup>
                {`Temperatura: ${temperature} °C`} <br />
                {`Persona: ${localStorage.getItem("displayName")}`} <br />
                {temperature < 37 ? `Estado: ${estado}` : `Estado: ${estado}`}
              </Popup>
            </Marker> */}
            <Pointer />
          </Map>
        </>
      )}
    </>
  );
};

export default Mapa;
