import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Importando axios
import styles from './styles/minhas-denuncias.module.css';
import { motion } from 'framer-motion';

const MinhasDenuncias = () => {
    const [denuncias, setDenuncias] = useState([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const fetchDenuncias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/denuncias'); // Substitua com a URL correta
                setDenuncias(response.data);
            } catch (error) {
                console.error('Erro ao buscar denúncias:', error);
            }
        };

        fetchDenuncias();
    }, []);

    const handleFilterChange = (e) => {
        setFiltro(e.target.value);
    };

    const filteredDenuncias = denuncias.filter(denuncia =>
        denuncia.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        denuncia.descricao.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link href="/">
                <motion.h1 className={`${styles.logo} ${styles.clickableLogo}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <span className={styles.gus}>Gus</span>
                    <span className={styles.alert}>Alert</span>
                </motion.h1>
            </Link>
            <h1 className={styles.title}>Minhas Denúncias</h1>
            <input
                type="text"
                placeholder="Filtrar denúncias..."
                value={filtro}
                onChange={handleFilterChange}
                className={styles.filterInput}
            />
            <div className={styles.denunciasList}>
                {filteredDenuncias.length === 0 ? (
                    <p className={styles.noDenuncias}>Nenhuma denúncia encontrada.</p>
                ) : (
                    filteredDenuncias.map((denuncia, index) => (
                        <motion.div key={index} className={styles.denunciaCard} initial={{ x: '-100vw' }} animate={{ x: 0 }} transition={{ delay: 0.2 * index, type: 'spring', stiffness: 120 }}>
                            <h2 className={styles.denunciaTitle}>{denuncia.titulo}</h2>
                            <p className={styles.denunciaDescription}>{denuncia.descricao}</p>
                            <Link href={`/denuncias/${denuncia.id}`}>
                                <a className={styles.detailsLink}>Ver Detalhes</a>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default MinhasDenuncias;
