import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import axios from "axios"
import { useRouter } from "next/router"
import styles from "./styles/realizar-denuncia.module.css"
import Link from "next/link"
import { motion } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import { TOKEN_LOCAL } from "./core/axios.interceptor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLightbulb,
  faWater,
  faRoad,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

const MapComponentWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

const SolicitarServiço = () => {
  const router = useRouter()
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [infoRua, setInfoRua] = useState("")
  const [descricao, setDescricao] = useState("")
  const [localizacao, setLocalizacao] = useState({ lat: null, lon: null })
  const [foto, setFoto] = useState(null)
  const [bairro, setBairro] = useState("")
  const [complemento, setComplemento] = useState("")

  const categoriaIcones = {
    Iluminacao: faLightbulb,
    Esgoto: faWater,
    Buraco: faRoad,
    Entulho: faTrash,
  }
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL)
    if (!token) {
    }
  }, [router])

  const categorias = {
    "Poste sem luz": "Iluminacao",
    "Esgoto exposto": "Esgoto",
    "Buraco na rua": "Buraco",
    "Coletar entulho": "Entulho",
  }

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categorias[categoria])
  }

  const handleBuscarEndereco = async () => {
    if (!infoRua) {
      alert("Por favor, digite um endereço.")
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          infoRua
        )}`
      )
      const data = await response.json()

      if (data.length === 0) {
        alert("Endereço não encontrado.")
        return
      }

      const { lat, lon } = data[0]
      setLocalizacao({ lat, lon })
      setInfoRua(data[0].display_name)
    } catch (error) {
      console.error("Erro ao buscar endereço:", error)
      alert("Erro ao buscar o endereço.")
    }
  }

  const handleEnviarDenuncia = async () => {
    if (
      !localizacao.lat ||
      !localizacao.lon ||
      !categoriaSelecionada ||
      !descricao ||
      !infoRua
    ) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    const token = localStorage.getItem(TOKEN_LOCAL)
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    const formData = new FormData()
    formData.append("tipo", categoriaSelecionada)
    formData.append("endereco", `${infoRua}, ${bairro}`)
    formData.append("descricao", descricao)
    formData.append("latitude", localizacao.lat)
    formData.append("longitude", localizacao.lon)
    formData.append("complemento", complemento)
    console.log(localizacao)

    if (foto) {
      formData.append("file", foto)
    }
    try {
      await axios.post("http://localhost:3001/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      alert("Solicitação enviada com sucesso!")
      router.push("/minhas-denuncias")
    } catch (error) {
      console.error("Erro no envio da solicitação:", error)
      alert("Erro no envio da solicitação .")
    }
  }

  const handleFileChange = (event) => {
    setFoto(event.target.files[0])
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.logo}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href="/">
          <span className={styles.gus}>Gus</span>
          <span className={styles.alert}>Alert</span>
        </Link>
      </motion.div>
      
      <div className={styles.introText}>
        Selecione a categoria do serviço para continuar:
      </div>

      <div className={styles.categorias}>
        {Object.keys(categorias).map((categoria) => (
          <motion.button
            key={categoria}
            className={`${styles.categoria} ${
              categoriaSelecionada === categorias[categoria]
                ? styles.categoriaSelecionada
                : ""
            }`}
            onClick={() => handleCategoriaClick(categoria)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={categoriaIcones[categorias[categoria]]} />
            {" " + categoria}
          </motion.button>
        ))}
      </div>
      <div className={styles.formWrapper}>
      {categoriaSelecionada && (
        <motion.div
          className={styles.detalhesDenuncia}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
           <input
            className={styles.input}
            type="text"
            placeholder="Endereço do problema"
            value={infoRua}
          />
 <input
            className={styles.input}
            type="text"
            placeholder="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />


          <textarea
            className={styles.textarea}
            placeholder="Descreva o problema"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

<label htmlFor="fotoProblema">Anexe uma foto do problema:</label>
  <input
    type="file"
    id="fotoProblema"
    accept="image/*" 
    onChange={handleFileChange}
  />
                 
      Marque a localização do problema no mapa: <div id="map" className={styles.mapPlaceholder}> 
            <MapComponentWithNoSSR
              setLocalizacao={setLocalizacao}
              setInfoRua={setInfoRua}
            />
          </div>
         

          <motion.button
            className={styles.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnviarDenuncia}
          >
            Enviar Solicitação
          </motion.button>
        </motion.div>
      )}
    </div>
    </div>
  )
}

export default SolicitarServiço
