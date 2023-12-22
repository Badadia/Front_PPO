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
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const { user, logout } = useAuth()
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("")
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
        router.push("/login")
      } else {
        axios
          .get(`http://localhost:3001/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setUserInfo(response.data))
          .catch((error) => {
            console.error("Erro ao buscar informações do usuário:", error)
            router.push("/login")
          })
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleChangeNome = async () => {
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.patch(
        `/user/${userInfo.id}`,
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
        `/user/${userInfo.id}`,
        { telefone: parsedFone },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Telefone atualizado com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar o telefone:", error)
    }
  }

  const handleChangePassword = async () => {
    if (novaSenha !== confirmarNovaSenha) {
      alert("As senhas não coincidem!")
      return
    }
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.patch(
        `/user/${userInfo.id}/password`,
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Senha alterada com sucesso")
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarNovaSenha("")
    } catch (error) {
      console.error("Erro ao mudar a senha:", error)
    }
  }

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
    )
    if (!confirmacao) return
    const token = localStorage.getItem(TOKEN_LOCAL)
    try {
      await axios.delete(`/user/${userInfo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem(TOKEN_LOCAL)
      alert("Conta excluída com sucesso")
      router.push("/login")
    } catch (error) {
      console.error("Erro ao excluir a conta:", error)
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

      <div className={styles.buttonsContainer}>
        <button onClick={toggleConfiguracoes} className={styles.perfilButton}>
          <FontAwesomeIcon
            icon={faUserEdit}
            className={styles.perfilButtonIcon}
          />
          Configurações
        </button>

        {exibirConfiguracoes && (
          <>
            {/* Seção para alterar o nome */}
            <button onClick={toggleAlterarNome} className={styles.perfilButton}>
              <FontAwesomeIcon
                icon={faUserEdit}
                className={styles.perfilButtonIcon}
              />
              Alterar Nome
            </button>
            {exibirAlterarNome && (
              <div>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Novo nome"
                />
                <button
                  onClick={handleChangeNome}
                  className={styles.perfilButton}
                >
                  Atualizar Nome
                </button>
              </div>
            )}

            {/* Seção para alterar o telefone */}
            <button
              onClick={toggleAlterarTelefone}
              className={styles.perfilButton}
            >
              <FontAwesomeIcon
                icon={faPhone}
                className={styles.perfilButtonIcon}
              />
              Alterar Telefone
            </button>
            {exibirAlterarTelefone && (
              <div>
                <input
                  type="tel"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                  placeholder="Novo telefone"
                />
                <button
                  onClick={handleChangeTelefone}
                  className={styles.perfilButton}
                >
                  Atualizar Telefone
                </button>
              </div>
            )}

            {/* Seção para alterar a senha */}
            <button
              onClick={toggleAlterarSenha}
              className={styles.perfilButton}
            >
              <FontAwesomeIcon
                icon={faKey}
                className={styles.perfilButtonIcon}
              />
              Alterar Senha
            </button>
            {exibirAlterarSenha && (
              <div className={styles.changePasswordSection}>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Senha Atual"
                />
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova Senha"
                />
                <input
                  type="password"
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="Confirmar Nova Senha"
                />
                <button
                  onClick={handleChangePassword}
                  className={styles.perfilButton}
                >
                  Alterar Senha
                </button>
              </div>
            )}

            {/* Seção para excluir a conta */}
            <button
              onClick={handleExcluirConta}
              className={styles.perfilButton}
            >
              <FontAwesomeIcon
                icon={faTrashAlt}
                className={styles.perfilButtonIcon}
              />
              Excluir Conta
            </button>
          </>
        )}
      </div>
      <button onClick={handleLogout} className={styles.perfilButton}>
        <FontAwesomeIcon
          icon={faSignOutAlt}
          className={styles.perfilButtonIcon}
        />
        Logout
      </button>
    </div>
  )
}

export default PerfilUsuario
