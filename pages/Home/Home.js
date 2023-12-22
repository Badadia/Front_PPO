"use client"
import React from 'react';
import Navbar from '../../src/app/components/Navbar/Navbar';
import Footer from '../../src/app/components/Footer/Footer';
import styles from './HomePage.module.css';

const HomePage = () => {

  
  return (
    <div className={styles.container}>
      <Navbar/> 
      <div className={styles.heroSection}>
        <img src="/HomeImage.jpg" alt="Relógio das Flores em Garanhuns" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>Bem-vindo ao GusAlert</h1>
          <p className={styles.p}>Nossa prioridade é ajudar você. Por aqui, você poderá realizar denúncias relacionadas
             a diversos setores. Além disso, também é possível solicitar serviços. Viu um esgoto estourado 
             e quer que os responsáveis arrumem? Aqui é o lugar certo! Tenha a garantia de que sua 
             solicitação chegará a eles!
             </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
