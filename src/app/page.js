import Header from './components/Header/Header';
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.heroSection}>
        <img src="/relogioDasFlores2.jpg" alt="Relógio das Flores em Garanhuns" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>Bem-vindo ao GusAlert</h1>
          <p>Garanhuns, conhecida como a Cidade das Flores, é um município brasileiro do estado de Pernambuco. Localizada no Agreste Pernambucano, é uma das cidades mais altas do estado, com clima ameno e diversas atrações turísticas.</p>
          <button className={styles.learnMoreBtn}>Saiba mais</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;

