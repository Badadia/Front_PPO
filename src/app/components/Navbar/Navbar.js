import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <span>
          <span className={styles.gus}>Gus</span>
          <span className={styles.alert}>Alert</span>
        </span>
      </Link>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/minhas-denuncias">
            <span className={styles.link}>Minhas Denúncias</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/realizar-denuncia">
            <span className={styles.link}>Realizar Denúncia</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/cadastrar">
            <span className={styles.link}>Cadastrar</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login">
            <span className={styles.link}>Login</span>
          </Link>
        </li>
        
        <li className={styles.navItem}>
          <Link href="/perfil-usuario">
            <span className={styles.link}>Perfil do Usuário</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
