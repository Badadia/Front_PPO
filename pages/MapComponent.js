import React, { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const MapComponent = ({
  localizacaoInicial,
  readOnly,
  setLocalizacao,
  setInfoRua,
}) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const initialLat = localizacaoInicial?.lat ?? -8.8829
    const initialLon = localizacaoInicial?.lon ?? -36.4966

    const map = L.map(mapRef.current).setView([initialLat, initialLon], 13)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; Contribuidores do OpenStreetMap",
    }).addTo(map)

    const customIcon = L.icon({
      iconUrl: "/marcador.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })

    const marker = L.marker([initialLat, initialLon], {
      icon: customIcon,
      draggable: !readOnly,
    }).addTo(map)

    if (localizacaoInicial) {
      marker.setLatLng(new L.LatLng(initialLat, initialLon))
      map.setView(new L.LatLng(initialLat, initialLon), 13)
    }

    if (readOnly) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
      if (map.tap) map.tap.disable()
      marker.draggable = false
    } else {
      marker.on("dragend", function (e) {
        const { lat, lng } = e.target.getLatLng()
        setLocalizacao({ lat, lon: lng })
        fetchInfoRua(lat, lng)
      })

      map.on("click", function (e) {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        setLocalizacao({ lat, lon: lng })
        fetchInfoRua(lat, lng)
      })
    }

    const fetchInfoRua = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await response.json()
        const rua = data.address.road || "Rua não encontrada"
        const bairro = data.address.suburb || "Bairro não encontrado"
        setInfoRua(`${rua}, ${bairro}`)
      } catch (err) {
        console.error("Erro ao buscar informações da rua:", err)
      }
    }

    return () => {
      map.remove()
    }
  }, [localizacaoInicial, readOnly, setLocalizacao, setInfoRua])

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
}

export default MapComponent
