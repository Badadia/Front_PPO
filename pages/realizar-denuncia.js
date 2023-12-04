import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importando axios
import styles from './styles/realizar-denuncia.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { useRouter } from 'next/router';

const RealizarDenuncia = () => {
  const router = useRouter();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);
  const [infoRua, setInfoRua] = useState('');
  const [descricao, setDescricao] = useState('');
  const [map, setMap] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
    }
    if (detalhesVisiveis) {
      const initialMap = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: fromLonLat([-36.4966, -8.8829]),
          zoom: 13,
          maxZoom: 17,
          minZoom: 11
        })
      });

      initialMap.on('singleclick', handleMapClick);
      setMap(initialMap);
    }
  }, [detalhesVisiveis, router]);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
    setDetalhesVisiveis(true);
  };

  const getStreetInfo = async (coordinate) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate[1]}&lon=${coordinate[0]}`);
      const data = await response.json();
      setInfoRua(data.display_name);
    } catch (error) {
      console.error('Erro ao buscar informações da rua:', error);
    }
  };

  const handleMapClick = (event) => {
    if (!map) return;
    const clickedCoordinate = toLonLat(event.coordinate);
    getStreetInfo(clickedCoordinate);
    setLocalizacao(clickedCoordinate);
    const marker = new Feature({
      geometry: new Point(event.coordinate)
    });
    marker.setStyle(new Style({
      image: new Icon({
        src: '/marcador.png',
        scale: 0.1
      })
    }));
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker]
      })
    });
    map.addLayer(vectorLayer);
  };

  const handleEnviarDenuncia = async () => {
    try {
      const denunciaData = {
        categoria: categoriaSelecionada,
        descricao,
        localizacao
      };
      await axios.post('http://localhost:3000/api/denuncias', denunciaData);
     
      setMensagemSucesso('Serviço solicitado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      setMensagemSucesso('');
    }
  };
  return (
    <div className={styles.container}>
      <motion.div className={styles.logo} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link href="/">
          <h1 className={styles.logo}>
            <span className={styles.gus}>Gus</span>
            <span className={styles.alert}>Alert</span>
          </h1>
        </Link>
      </motion.div>
      <div className={styles.introText}>
        Selecione a categoria da denúncia para continuar:
      </div>
      <div className={styles.categorias}>
        {['Poste sem luz', 'Esgoto exposto', 'Buraco na rua', 'Coletar entulho'].map((categoria) => (
          <motion.button
            key={categoria}
            className={`${styles.categoria} ${categoriaSelecionada === categoria ? styles.categoriaSelecionada : ''}`}
            onClick={() => handleCategoriaClick(categoria)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoria}
          </motion.button>
        ))}
      </div>
      {detalhesVisiveis && (
        <motion.div className={styles.detalhesDenuncia} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <input className={styles.input} type="text" placeholder="Endereço do problema" value={infoRua} />
          <textarea className={styles.textarea} placeholder="Descreva o problema"></textarea>
          <input className={styles.inputFile} type="file" accept="image/*" />
          <div id="map" className={styles.mapPlaceholder}>Localização no mapa</div>

          <motion.button className={styles.submitButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Enviar denúncia
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default RealizarDenuncia;
