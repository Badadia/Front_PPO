import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Importando motion
import styles from './styles/perfil-usuario.module.css';

const PerfilUsuario = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({ nome: '', email: '' });
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setUserInfo(response.data))
      .catch(error => {
        console.error(error);
        router.push('/login');
      });
  }, [router]);

  const handleChangePassword = () => {
    const token = localStorage.getItem('userToken');
    axios.put('/api/change-password', { novaSenha }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        console.log('Senha alterada com sucesso');
        setNovaSenha('');
      })
      .catch(error => console.error('Erro ao mudar a senha:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <div className={styles.perfilContainer}>
      {}
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

      <div className={styles.changePasswordSection}>
        <h2>Alterar Senha</h2>
        <input 
          type="password" 
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)} 
          placeholder="Nova Senha" 
        />
        <button onClick={handleChangePassword}>Alterar Senha</button>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default PerfilUsuario;
