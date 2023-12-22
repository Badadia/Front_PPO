import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { useGeographic } from 'ol/proj';

const MapComponent = ({ setInfoRua }) => {
  const [localizacao, setLocalizacao] = useState({ lat: -8.8829, lon: -36.4966 });

  useEffect(() => {
    useGeographic();

    const initialCoordinates = [-36.4966, -8.8829];

    const map = new Map({
      target: 'ol-map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: initialCoordinates,
        zoom: 13,
      }),
    });

    const iconFeature = new Feature({
      geometry: new Point(initialCoordinates),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'marcador.png',
        scale: 0.5,
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    map.on('singleclick', function (evt) {
      const coordinate = evt.coordinate;
      iconFeature.setGeometry(new Point(coordinate));
      setLocalizacao({ lat: coordinate[1], lon: coordinate[0] });

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate[1]}&lon=${coordinate[0]}`)
        .then(response => response.json())
        .then(data => {
          const rua = data.address.road || 'Rua não encontrada';
          const bairro = data.address.suburb || 'Bairro não encontrado';
          setInfoRua(`${rua}, ${bairro}`);
        })
        .catch(err => console.error('Erro ao buscar informações da rua:', err));
    });
  }, [setLocalizacao, setInfoRua]);

  return (
    <div>
      <div id="ol-map" style={{ height: '400px', width: '100%' }} />
      <div>Coordenadas: {localizacao.lat.toFixed(4)}, {localizacao.lon.toFixed(4)}</div>
    </div>
  );
};

export default MapComponent;
