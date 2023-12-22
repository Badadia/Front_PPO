'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';


import {
  faUserCircle,
  faHome,
  faTasks,
  faUsers,
  faSignInAlt,
  faUserPlus,
  faEnvelopeOpenText,
  faToolbox 
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <span className={styles.gus}>Gus</span>
        <span className={styles.alert}>Alert</span>
      </Link>

      <ul className={styles.navList}>
        {user && user.role === 'admin' && (
          <>
            <li className={styles.navItem}>
              <Link href="/ADM/solicitacoes">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faTasks} />
                  Solicitações
                </span>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/ADM/usuarios">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faUsers} />
                  Usuários
                </span>
              </Link>
            </li>
          </>
        )}
        {user && user.role === 'user' && (
          <>
            <li className={styles.navItem}>
              <Link href="/minhas-denuncias">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  Minhas Solicitações
                </span>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/realizar-denuncia2">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faToolbox} />
                  Realizar Denúncia
                </span>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/realizar-denuncia">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faToolbox} />
                  Solicitar Serviço
                </span>
              </Link>
            </li>
          </>
        )}
        {!user && (
          <>
            <li className={styles.navItem}>
              <Link href="/cadastrar">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faUserPlus} />
                  Cadastrar
                </span>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/login">
                <span className={styles.navLink}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login
                </span>
              </Link>
            </li>
          </>
        )}
        {user && (
          <li className={styles.navItem}>
            <Link href="/perfil-usuario">
                <FontAwesomeIcon icon={faUserCircle} className={styles.navLink} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
