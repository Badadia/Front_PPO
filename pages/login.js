import React, { useState } from "react"
import Link from "next/link"
import styles from "./styles/login.module.css"
import { motion } from "framer-motion"
import appAxios, { TOKEN_LOCAL } from "./core/axios.interceptor"
import { useRouter } from "next/router"; 


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const router = useRouter();

      const user = {
        
        email: formData.email,
        senha: formData.senha,
      }
      appAxios
        .post("/login", user)
        .then((res) => {
          const token = res.headers.authorization
          console.log(token)
          if (token) localStorage.setItem(TOKEN_LOCAL, JSON.stringify(token))
          //TODO: no logout => localStorage.removeItem(TOKEN_LOCAL)
        })
        .catch((res) => console.log(res))
        router.push('/');
    } 
     catch (error) {
      console.error("Erro ao efetuar login:", error)
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
          {" "}
          <span className={styles.link}>
            É novo por aqui? <Link href="/cadastrar">Cadastra-se</Link> no nosso
            site!
          </span>
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
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
            type="password"
            placeholder="Senha"
            name="senha"
            required
            onChange={handleChange}
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
          />

          <motion.button
            className={styles.loginButton}
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Entrar
          </motion.button>
        </form>
      </div>
      <div className={styles.rightSection}>
        <img
          src="/FotoLogin.jpg"
          alt="Fundo do Login"
          className={styles.illustration}
        />
      </div>
    </motion.div>
  )
}

export default Login