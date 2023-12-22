import React, { useState } from "react"
import Link from "next/link"
import styles from "./styles/cadastrar.module.css"
import { motion } from "framer-motion"
import appAxios, { TOKEN_LOCAL } from "./core/axios.interceptor"
import { useRouter } from "next/router"
import { jwtDecode } from "jwt-decode"

const Cadastrar = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!")
      return
    }

    const telefone = formData.telefone
    const parsedFone = parseInt(telefone)
    try {
      setLoading(true)
      const user = {
        nome: formData.nome,
        telefone: parsedFone,
        email: formData.email,
        senha: formData.senha,
      }

      const response = await appAxios.post("/user", user)
      const token = response

      if (token) {
        router.push("/login")
      } else {
        setError("Token não recebido.")
      }
    } catch (error) {
      setLoading(false)
      setError("Erro ao cadastrar. Tente novamente.")
      console.error("Erro ao cadastrar:", error)
    }
  }
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.leftSection}>
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
        <motion.h2
          className={styles.welcomeText}
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          Bem-vindo!
        </motion.h2>
        <p>
          Já tem uma conta?{" "}
          <span className={styles.link}>
            <Link href="/login">Entrar</Link>
          </span>
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Campos de entrada */}
          <motion.input
            className={styles.input}
            type="text"
            placeholder="Nome"
            name="nome"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          />
          <motion.input
            className={styles.input}
            type="email"
            placeholder="Email"
            name="email"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          />
          <motion.input
            className={styles.input}
            type="number"
            placeholder="Telefone"
            name="telefone"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
          />
          <motion.input
            className={styles.input}
            type="password"
            placeholder="Senha"
            name="senha"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
          />
          <motion.input
            className={styles.input}
            type="password"
            placeholder="Confirmar Senha"
            name="confirmarSenha"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
          />
          <motion.button
            className={styles.registerButton}
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </motion.button>
        </form>
      </div>
      <div className={styles.rightSection}>
        <img
          src="/FotoCadastrar.jpg"
          alt="Fundo do cadastrar"
          className={styles.illustration}
        />
      </div>
    </motion.div>
  )
}

export default Cadastrar
