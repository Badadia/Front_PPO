import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import styles from "./styles/minhas-denuncias.module.css"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { jwtDecode } from "jwt-decode"
import { TOKEN_LOCAL } from "./core/axios.interceptor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faWrench, faTools } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"

const MinhasDenuncias = () => {
  const router = useRouter();
  const [verificarD, setVerificarD] = useState(false);
  const [verificarS, setVerificarS] = useState(false);
  const [denuncias, setDenuncias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [detalheDenunciaId, setDetalheDenunciaId] = useState(null);
  const [detalheServicoId, setDetalheServicoId] = useState(null);
  const [exibirMaisDenuncias, setExibirMaisDenuncias] = useState(false);
  const [exibirMaisServicos, setExibirMaisServicos] = useState(false);

  const MapComponentWithNoSSR = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => <p>Carregando mapa...</p>,
  });
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL)

    if (token != null) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.sub
      const DataAtual = new Date()
      const Horario = parseInt(DataAtual.valueOf() / 1000)

      if (decodedToken.role === "admin") {
       // router.push("/")
      } else if (decodedToken.exp < Horario) {
      //  router.push("/login")
      } else {
        const fetchDenuncias = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3001/complaints/user/${userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            setDenuncias(response.data)
          } catch (error) {
            console.error("Erro ao buscar denúncias:", error)
          }
        }
        const fetchServicos = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3001/services/user/${userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            setServicos(response.data)
          } catch (error) {
            console.error("Erro ao buscar serviços:", error)
          }
        }
        fetchServicos()
        fetchDenuncias()
      }
    } else {
  //    router.push("/login")
    }
  }, [])

  const handleFilterChange = (e) => {
    setFiltro(e.target.value)
  }

  const handleDetalheClick = (id) => {
    setDetalheDenunciaId(detalheDenunciaId === id ? null : id)
  }

  const handleDetalheClickServico = (id) => {
    setDetalheServicoId(detalheServicoId === id ? null : id)
  }

  const mostrarMaisDenuncias = () => {
    setExibirMaisDenuncias(true)
  }

  const mostrarMaisServicos = () => {
    setExibirMaisServicos(true)
  }

  const filteredDenuncias = denuncias.filter((denuncia) =>
    denuncia.setor.toLowerCase().includes(filtro.toLowerCase())
  )

  const filteredServicos = servicos.filter((servico) =>
    servico.tipo.toLowerCase().includes(filtro.toLowerCase())
  )
  console.log(filteredServicos)

  const toggleVerificarD = () => {
    setVerificarD(!verificarD)
    setVerificarS(false)
  }

  const toggleVerificarS = () => {
    setVerificarS(!verificarS)
    setVerificarD(false)
  }
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/">
        <motion.h1
          className={`${styles.logo} ${styles.clickableLogo}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className={styles.gus}>Gus</span>
          <span className={styles.alert}>Alert</span>
        </motion.h1>
      </Link>
      <h1 className={styles.title}>Minhas Solicitações</h1>
      <div className={styles.buttonsContainer}>
        <motion.button className={styles.verButton} onClick={toggleVerificarS}>
          <FontAwesomeIcon icon={faWrench} className={styles.verButtonIcon} />
          Ver Serviços
        </motion.button>
        <motion.button className={styles.verButton} onClick={toggleVerificarD}>
          <FontAwesomeIcon icon={faEye} className={styles.verButtonIcon} />
          Ver Denúncias
        </motion.button>
      </div>
      <input
        type="text"
        placeholder="Filtrar solicitações..."
        value={filtro}
        onChange={handleFilterChange}
        className={styles.filterInput}
      />

{verificarD && (
  <div className={styles.denunciasList}>
    {filteredDenuncias
      .slice(0, exibirMaisDenuncias ? filteredDenuncias.length : 8)
      .map((denuncia) => (
        <div key={denuncia.id} className={styles.card}>
          <h2 className={styles.cardTitle}>{denuncia.setor}</h2>
          <p className={styles.status}>Status: {denuncia.status}</p>
          <p className={styles.detailsLink} onClick={() => handleDetalheClick(denuncia.id)}>
            Ver Detalhes
          </p>
          {detalheDenunciaId === denuncia.id && (
                
            <div  className={styles.detalhes}>
              <p className={styles.cardDescription}>Descrição: {denuncia.descricao}</p>
              <p className={styles.status}>Endereço: {denuncia.endereco}</p>
              <p className={styles.complemento}>Complemento: {denuncia.complemento}</p>
             
              <img src={"http://localhost:3001/uploads/" + denuncia.imageUrl} alt="Foto da Denúncia" className={styles.denunciaFoto} />
              {denuncia.location && (
                <div className={styles.mapPlaceholder}>
                  <MapComponentWithNoSSR
                    localizacaoInicial={{
                      lat: denuncia.location.coordinates[1], 
                      lon: denuncia.location.coordinates[0]
                    }}
                    readOnly={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    {filteredDenuncias.length > 8 && !exibirMaisDenuncias && (
      <button onClick={mostrarMaisDenuncias}>Ver Mais</button>
    )}
  </div>
)}

{verificarS && (
  <div className={styles.servicosList}>
    {filteredServicos
      .slice(0, exibirMaisServicos ? filteredServicos.length : 8)
      .map((servico) => (
        <div key={servico.id} className={styles.card}>
          <h2 className={styles.cardTitle}>{servico.tipo}</h2>
          <p className={styles.status}>Status: {servico.status}</p>
          <p className={styles.detailsLink} onClick={() => handleDetalheClickServico(servico.id)}>
            Ver Detalhes
          </p>
          {detalheServicoId === servico.id && (
            <div  className={styles.detalhes}>
              <p className={styles.cardDescription}>Descrição: {servico.descricao}</p>
              <p className={styles.status}>Endereço: {servico.endereco}</p>
              <p className={styles.complemento}>Complemento: {servico.complemento}</p>
              
              <img src={"http://localhost:3001/uploads/" + servico.imageUrl} alt="Foto do Serviço" className={styles.servicoFoto} />
              {servico.location && (
                <div className={styles.mapPlaceholder}>
                  <MapComponentWithNoSSR
                    localizacaoInicial={{
                      lat: servico.location.coordinates[1], 
                      lon: servico.location.coordinates[0]
                    }}
                    readOnly={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    {filteredServicos.length > 8 && !exibirMaisServicos && (
      <button onClick={mostrarMaisServicos}>Ver Mais</button>
    )}
  </div>
)}


      
    </motion.div>
  )
}

export default MinhasDenuncias
