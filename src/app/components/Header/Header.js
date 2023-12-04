import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Bem-vindo ao Portal de Denúncias de Garanhuns</h1>
      <p className={styles.subtitle}>Ajude-nos a melhorar a infraestrutura da cidade, reportando problemas que você encontrar.</p>
    </header>
  );
};

export default Header;
