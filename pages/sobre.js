import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./styles/sobre.module.css"; // Ajuste o caminho conforme necessário
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';


const Sobre = () => {
  const [showTeam, setShowTeam] = useState(false);
  const [showAboutSite, setShowAboutSite] = useState(false);

  const teamMembers = [
    { 
      name: "Bryan Belo", 
      role: "Dev BackEnd", 
      image: "/batata.jpg", 
      contact: "Bbn@discente.ifpe.edu.br",
      instagram: "@bryan_bello0",
      github: "@Badadia"
    },
    { 
      name: "Gustavo de Lima", 
      role: "Dev FrontEnd", 
      image: "/guguinha.jpg", 
      contact: "gls9@discente.ifpe.edu.br",
      instagram: "@gustavolima.7",
      github: "@gugiaa"
    },
    { 
      name: "Adalberto Filho", 
      role: "Dev BackEnd", 
      image: "/Beto.jpg", 
      contact: "Assf@discente.ifpe.edu.br",
      instagram: "@betttinho_silva"
      // Adalberto não tem GitHub
    }
  ];

  return (
    <motion.div
      className={styles.sobreContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/">
        <motion.h1 className={`${styles.logo} ${styles.clickableLogo}`}>
          <span className={styles.gus}>Gus</span>
          <span className={styles.alert}>Alert</span>
        </motion.h1>
      </Link>

      <div className={styles.content}>
        <h2 onClick={() => setShowTeam(!showTeam)}>
          <FontAwesomeIcon icon={faUsers} /> Nossa Equipe
        </h2>
        {showTeam && (
          <div className={styles.teamSection}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <img src={member.image} alt={member.name} className={styles.memberPhoto} />
                <div className={styles.memberInfo}>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <p>{member.bio}</p>
                  <p><FontAwesomeIcon icon={faEnvelope} /> {member.contact}</p>
                  <p><FontAwesomeIcon icon={faInstagram} /> {member.instagram}</p>
                  {member.github && <p><FontAwesomeIcon icon={faGithub} /> {member.github}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 onClick={() => setShowAboutSite(!showAboutSite)}>
          <FontAwesomeIcon icon={faBuilding} /> Sobre Nosso Site
        </h2>
        {showAboutSite && (
          <div className={styles.aboutSiteSection}>

            <h3>Bem-vindo ao Portal da Cidadania de Garanhuns: O Seu Aliado para uma Cidade Melhor!</h3>
            <p>Na busca contínua por melhorar nossa querida cidade,
               este portal é a sua principal ferramenta de voz ativa. 
               Estamos dedicados a tornar Garanhuns um lugar ainda melhor 
               para se viver, e você é parte essencial deste processo.</p>
               
               <h3>Denuncie e Solicite com Facilidade</h3>
               
               <p> Sua participação é vital. Com cada denúncia e solicitação,
                 você contribui para a melhoria contínua de nossa cidade. 
                 Este é o seu espaço para fazer a diferença em Garanhuns. Juntos, 
                 podemos construir uma cidade mais segura, limpa e acolhedora para todos.</p>
          
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sobre;