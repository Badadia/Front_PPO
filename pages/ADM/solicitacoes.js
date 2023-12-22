import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import styles from "./styles-adm/solicitações.module.css" // Ajuste para o caminho correto
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { jwtDecode } from "jwt-decode"
import { TOKEN_LOCAL } from "../core/axios.interceptor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faWrench, faTools } from "@fortawesome/free-solid-svg-icons"

const MapComponentWithNoSSR = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

const MinhasDenuncias = () => {
  const router = useRouter()
  const [statusDen, setStatusDen] = useState(false)
  const [statusSer, setStatusSer] = useState("")
  const [verificarD, setVerificarD] = useState(false)
  const [verificarS, setVerificarS] = useState(false)
  const [denuncias, setDenuncias] = useState([])
  const [servicos, setServicos] = useState([])
  const [filtro, setFiltro] = useState("")
  const [detalheDenunciaId, setDetalheDenunciaId] = useState(null)
  const [detalheServicoId, setDetalheServicoId] = useState(null)
  const [exibirMaisDenuncias, setExibirMaisDenuncias] = useState(false)
  const [exibirMaisServicos, setExibirMaisServicos] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL)

    if (token != null) {
      const TokenDecodificado = jwtDecode(token)
      const DataAtual = new Date()
      const Horario = parseInt(DataAtual.valueOf() / 1000)

      if (TokenDecodificado.role != "admin") {
        router.push("/")
      } else if (TokenDecodificado.exp < Horario) {
        router.push("/login")
      } else {
        const fetchDenuncias = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3001/complaints`,
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
            const response = await axios.get(`http://localhost:3001/services`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            setServicos(response.data)
          } catch (error) {
            console.error("Erro ao buscar serviços:", error)
          }
        }
        fetchServicos()
        fetchDenuncias()
      }
    } else {
      router.push("/login")
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
  const statusS = (status, id) => {
    const fetchStatusS = async () => {
      try {
        await axios.patch(
          `http://localhost:3001/services/${id}/status`,
          {
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL)}`,
            },
          }
        )
        router.push("/")
      } catch (error) {
        console.error("Erro ao alterar o status do serviço:", error)
      }
    }
    fetchStatusS()
  }
  const statusD = (status, id) => {
    const fetchStatusD = async () => {
      try {
        await axios.patch(
          `http://localhost:3001/complaints/${id}/status`,
          {
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL)}`,
            },
          }
        )
        router.push("/")
      } catch (error) {
        console.error("Erro ao alterar status da denúncia:", error)
      }
    }
    fetchStatusD()
  }
  const delS = (id) => {
    const fetchDels = async () => {
      try {
        await axios.delete(`http://localhost:3001/services/` + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL)}`,
          },
        })
        router.push("/")
      } catch (error) {
        console.error("Erro ao deletar serviço:", error)
      }
    }
    fetchDels()
  }
  const delD = (id) => {
    const fetchDelD = async () => {
      try {
        await axios.delete(`http://localhost:3001/complaints/` + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL)}`,
          },
        })
        router.push("/")
      } catch (error) {
        console.error("Erro ao deletar denúncias:", error)
      }
    }
    fetchDelD()
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
              <motion.div
                key={denuncia.id}
                className={styles.denunciaCard}
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              >
                <h2 className={styles.denunciaTitle}>{denuncia.tipo}</h2>

                <p
                  className={styles.detailsLink}
                  onClick={() => {
                    handleDetalheClick(denuncia.id),
                      setStatusDen(denuncia.status)
                  }}
                >
                  Ver Detalhes
                </p>
                {detalheDenunciaId === denuncia.id && (
                  <div className={styles.detalhes}>
                    <p>Endereço: {denuncia.endereco}</p>
                    <img
                      src={denuncia.foto}
                      alt="Foto da Denúncia"
                      className={styles.denunciaFoto}
                    />
                    <div className={styles.mapContainer}>
                      <MapComponentWithNoSSR
                        localizacaoInicial={{
                          lat: denuncia.latitude,
                          lon: denuncia.longitude,
                        }}
                        readOnly={true}
                      />
                    </div>
                    <div>
                      <label htmlFor="Status">Status:</label>
                      <select
                        name="Status"
                        id={"Status"}
                        onChange={(e) => {
                          setStatusDen(e.target.value)
                        }}
                      >
                        {statusDen == "Inalterado" && (
                          <>
                            <option value="Inalterado">inalterado</option>
                            <option value="Visualizado">Visualizado</option>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                        {statusDen == "Visualizado" && (
                          <>
                            <option value="Visualizado">Visualizado</option>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}

                        {statusDen == "Em processo" && (
                          <>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                        {statusDen == "Concluido" && (
                          <>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                      </select>
                    </div>
                    <p className={styles.denunciaDescription}>
                      {denuncia.descricao}
                    </p>
                    <motion.button
                      onClick={() => {
                        statusD(statusDen, denuncia.id)
                      }}
                    >
                      Alterar
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        delD(denuncia.id)
                      }}
                    >
                      Excluir
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          {filteredDenuncias.length > 8 && !exibirMaisDenuncias && (
            <button onClick={mostrarMaisDenuncias}>Ver Mais</button>
          )}
        </div>
      )}
      <div className={styles.buttonsContainer}>
        <motion.button
          className={styles.verButton}
          onClick={() => setVerificarS(!verificarS)}
        >
          <FontAwesomeIcon icon={faWrench} className={styles.verButtonIcon} />
          Ver Serviços
        </motion.button>
        <motion.button
          className={styles.verButton}
          onClick={() => setVerificarD(!verificarD)}
        >
          <FontAwesomeIcon icon={faEye} className={styles.verButtonIcon} />
          Ver Denúncias
        </motion.button>
      </div>

      {verificarS && (
        <div className={styles.servicosList}>
          {filteredServicos
            .slice(0, exibirMaisServicos ? filteredServicos.length : 8)
            .map((servico) => (
              <motion.div
                key={servico.id}
                className={styles.servicoCard}
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              >
                <h2 className={styles.servicoTitle}>{servico.tipo}</h2>
                <p
                  className={styles.detailsLink}
                  onClick={() => {
                    handleDetalheClickServico(servico.id),
                      setStatusSer(servico.status)
                  }}
                >
                  Ver Detalhes
                </p>
                {detalheServicoId === servico.id && (
                  <div className={styles.detalhes}>
                    <p>Endereço: {servico.endereco}</p>
                    <img
                      src={servico.foto}
                      alt="Foto do Serviço"
                      className={styles.servicoFoto}
                    />
                    <div className={styles.mapContainer}>
                      <MapComponentWithNoSSR
                        localizacaoInicial={{
                          lat: servico.latitude,
                          lon: servico.longitude,
                        }}
                        readOnly={true}
                      />
                    </div>
                    <div>
                      <label htmlFor="Status">Status:</label>
                      <select
                        name="Status"
                        id={"Status"}
                        onChange={(e) => {
                          setStatusSer(e.target.value)
                        }}
                      >
                        {statusSer == "Inalterado" && (
                          <>
                            <option value="Inalterado">Inalterado</option>
                            <option value="Visualizado">Visualizado</option>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                        {statusSer == "Visualizado" && (
                          <>
                            <option value="Visualizado">Visualizado</option>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                        {statusSer == "Em processo" && (
                          <>
                            <option value="Em processo">Em processo</option>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                        {statusSer == "Concluido" && (
                          <>
                            <option value="Concluido">Concluido</option>
                          </>
                        )}
                      </select>
                    </div>

                    <p className={styles.servicoDescription}>
                      {servico.descricao}
                    </p>
                    <motion.button
                      onClick={() => {
                        statusS(statusSer, servico.id)
                      }}
                    >
                      Alterar
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        delS(servico.id)
                      }}
                    >
                      Excluir
                    </motion.button>
                  </div>
                )}
              </motion.div>
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
