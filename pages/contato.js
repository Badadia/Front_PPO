import React from "react";
import Link from "next/link";
import styles from "./styles/contato.module.css"; // Ajuste o caminho conforme necessário
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Contato = () => {
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

      <div className={styles.contactSection}>
        <h2>Entre em Contato Conosco</h2>

     
        <div className={styles.contactInfo}>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Endereço: Rua Exemplo, 123, Cidade</p>

          <p><FontAwesomeIcon icon={faPhone} /> Telefone: (00) 1234-5678</p>
          
          <p><FontAwesomeIcon icon={faEnvelope} /> Email: contato@gusalert.com</p>
        </div>

        
      </div>
    </motion.div>
  );
};

export default Contato;
