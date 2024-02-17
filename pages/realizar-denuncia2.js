import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import axios from "axios"
import { useRouter } from "next/router"
import styles from "./styles/realizar-denuncia2.module.css"
import Link from "next/link"
import { motion } from "framer-motion"
import { jwtDecode } from "jwt-decode"
import { TOKEN_LOCAL } from "./core/axios.interceptor"

const MapComponentWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

const RealizarDenuncia = () => {
  const router = useRouter()
  const [infoRua, setInfoRua] = useState("")
  const [descricao, setDescricao] = useState("")
  const [setor, setSetor] = useState("")
  const [localizacao, setLocalizacao] = useState({ lat: null, lon: null })
  const [foto, setFoto] = useState(null)
  const [complemento, setComplemento] = useState("")

  const setores = [
   
    
  
   

   
   
  
   
    "Energia",
    "Estradas",
   
   
   
  
    
    
  
    "Saneamento",
   
   
    "Urbanismo",
  ]
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL)

    if (token != null) {
      const decodedToken = jwtDecode(token)
      const DataAtual = new Date()
      const Horario = parseInt(DataAtual.valueOf() / 1000)

      if (decodedToken.role === "admin") {
   //   router.push("/")
      } else if (decodedToken.exp < Horario) {
   //   router.push("/login")
      }
    } else {
 //   router.push("/login")
    }
  }, [router])

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
    if (!localizacao.lat || !localizacao.lon || !descricao || !infoRua) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    const token = localStorage.getItem(TOKEN_LOCAL)
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    const formData = new FormData()
    formData.append("endereco", infoRua)
    formData.append("descricao", descricao)
    formData.append("setor", setor)
    formData.append("latitude", localizacao.lat)
    formData.append("longitude", localizacao.lon)
    formData.append("complemento", complemento)

    if (foto) {
      formData.append("file", foto)
    }

    try {
      await axios.post("http://localhost:3001/complaints", formData, {
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
      

      <div className={styles.formulario}>
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
        <div className={styles.itemForm}>
          <label className={styles.label} htmlFor="setor">
            Setor:
          </label>
          <select
            className={styles.input}
            value={setor}
            name="setor"
            id="setor"
            onChange={(e) => setSetor(e.target.value)}
          >
            {setores.sort().map((setor, index) => (
              <option key={index} value={setor}>
                {setor}
              </option>
            ))}
          </select>
        </div>
        Anexe uma foto do problema:
        <div className={styles.fileInputContainer}>
  <label htmlFor="fotoProblema"></label>
  <input
    type="file"
    id="fotoProblema"
    accept="image/*" 
    onChange={handleFileChange}
  />
</div>
Marque a localização do problema no mapa:   <div id="map" className={styles.mapPlaceholder}>
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
          Enviar Denúncia
        </motion.button>
      </div>
    </div>
  )
}

export default RealizarDenuncia
