import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.footerList}>
        <li className={styles.footerItem}><Link href="/contato" className={styles.link}>Contato</Link></li>
        <li className={styles.footerItem}><Link href="/sobre" className={styles.link}>Sobre</Link></li>
      </ul>
    </footer>
  );
};

export default Footer;
