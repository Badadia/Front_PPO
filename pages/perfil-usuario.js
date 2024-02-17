import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"
import { motion } from "framer-motion"
import styles from "./styles/perfil-usuario.module.css"
import { jwtDecode } from "jwt-decode"
import { TOKEN_LOCAL } from "./core/axios.interceptor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUserEdit,
  faPhone,
  faKey,
  faTrashAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../src/app/components/contexts/AuthContext"

const PerfilUsuario = () => {
  const router = useRouter()
  const [novoNome, setNovoNome] = useState("")
  const [novoTelefone, setNovoTelefone] = useState("")
  const [userInfo, setUserInfo] = useState({ nome: "", email: "" })

  const [senha, setNovaSenha] = useState("")
  const { user, logout } = useAuth()

  const [exibirConfiguracoes, setExibirConfiguracoes] = useState(false)
  const [exibirAlterarNome, setExibirAlterarNome] = useState(false)
  const [exibirAlterarTelefone, setExibirAlterarTelefone] = useState(false)
  const [exibirAlterarSenha, setExibirAlterarSenha] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_LOCAL)

    if (token != null) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.sub
      const DataAtual = new Date()
      const Horario = parseInt(DataAtual.valueOf() / 1000)

      if (decodedToken.exp < Horario) {
        // router.push("/login")
      } else {
        axios
          .get(`http://localhost:3001/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUserInfo(response.data)
            // Atualiza os estados com os dados atuais do usuário
            setNovoNome(response.data.nome)
            setNovoTelefone(response.data.telefone.toString()) // Certifique-se de converter para string se necessário
          })
          .catch((error) => {
            console.error("Erro ao buscar informações do usuário:", error)
            // router.push("/login")
          })
      }
    } else {
      // router.push("/login")
    }
  }, [router])

  const handleChangeNome = async () => {
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.patch(
        `http://localhost:3001/user/${userInfo.id}`,
        { nome: novoNome },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUserInfo((prev) => ({ ...prev, nome: novoNome }))
      alert("Nome atualizado com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar o nome:", error)
    }
  }

  const handleChangeTelefone = async () => {
    const parsedFone = parseInt(novoTelefone)
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.patch(
        `http://localhost:3001/user/${userInfo.id}`,
        { telefone: parsedFone },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUserInfo((prev) => ({ ...prev, telefone: novoTelefone }))
      alert("Telefone atualizado com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar o telefone:", error)
    }
  }

  const handleChangePassword = async () => {
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.patch(
        `http://localhost:3001/user/${userInfo.id}`,
        { senha },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Senha alterada com sucesso")
      setNovaSenha("")
    } catch (error) {
      console.error("Erro ao mudar a senha:", error)
      alert("Erro ao tentar alterar a senha.")
    }
  }

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
    )
    if (!confirmacao) return
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.delete(`http://localhost:3001/user/${userInfo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem(TOKEN_LOCAL)
      alert("Conta excluída com sucesso")
      router.push("/login")
    } catch (error) {
      console.error("Erro ao excluir a conta:", error)
    }
  }
  const handleChangeNomeTelefone = async () => {
    const token = localStorage.getItem(TOKEN_LOCAL)
    const parsedFone = parseInt(novoTelefone)
    try {
      await axios.patch(
        `http://localhost:3001/user/${userInfo.id}`,
        { nome: novoNome, telefone: parsedFone },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUserInfo((prev) => ({
        ...prev,
        nome: novoNome,
        telefone: novoTelefone,
      }))
      alert("Informações atualizadas com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar informações:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleConfiguracoes = () => {
    setExibirConfiguracoes(!exibirConfiguracoes)
  }

  const toggleAlterarNome = () => setExibirAlterarNome(!exibirAlterarNome)
  const toggleAlterarTelefone = () =>
    setExibirAlterarTelefone(!exibirAlterarTelefone)
  const toggleAlterarSenha = () => setExibirAlterarSenha(!exibirAlterarSenha)

  return (
    <div className={styles.perfilContainer}>
      <Link href="/" passHref>
        <motion.h1
          className={`${styles.logo} ${styles.clickableLogo}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className={styles.gus}>Gus</span>
          <span className={styles.alert}>Alert</span>
        </motion.h1>
      </Link>

      <h1>Perfil do Usuário</h1>
      <p>Nome: {userInfo.nome}</p>
      <p>Email: {userInfo.email}</p>

      {/* Opções de configuração visíveis desde o início */}
      <div className={styles.buttonsContainer}>
        {/* Campos para alterar nome e telefone */}
        <div className={styles.configSection}>
          <label>Alterar nome:</label>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Novo nome"
          />

          <label>Alterar telefone:</label>
          <input
            type="tel"
            value={novoTelefone}
            onChange={(e) => setNovoTelefone(e.target.value)}
            placeholder="Novo telefone"
          />

          <button
            onClick={handleChangeNomeTelefone}
            className={styles.perfilButton}
          >
            Atualizar Informações
          </button>
        </div>

        {/* Campo para alterar a senha */}
        <div className={styles.configSection}>
          <label>Alterar senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Nova Senha"
          />

          <button
            onClick={handleChangePassword}
            className={styles.confirmButton}
          >
            Atualizar Senha
          </button>
        </div>

        {/* Seção para excluir a conta */}
        <button
          onClick={handleExcluirConta}
          className={styles.perfilButtonDanger}
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={styles.perfilButtonIcon}
          />
          Excluir Conta
        </button>

        {/* Botão de Logout */}
        <button onClick={handleLogout} className={styles.confirmButton}>
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className={styles.perfilButtonIcon}
          />
          Logout
        </button>
      </div>
    </div>
  )
}

export default PerfilUsuario
