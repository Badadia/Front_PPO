import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link"
import styles from "./styles-adm/usuarios.module.css";
import { useRouter } from 'next/router';
import { TOKEN_LOCAL } from "../core/axios.interceptor";
import { jwtDecode } from "jwt-decode";


const Usuarios = () =>{

    const router = useRouter();

    const [Usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [exibirMais, setExibirMais] = useState(false);


    useEffect(() => {

      const token = localStorage.getItem(TOKEN_LOCAL)
      
      if (token != null) {
        
      const TokenDecodificado = jwtDecode(token)
      const DataAtual = new Date();
      const Horario = parseInt(DataAtual.valueOf()/1000);

        if(TokenDecodificado.role != "admin"){
          router.push("/")
        }
        else if(TokenDecodificado.exp < Horario){
          router.push("/login")
        }
        else{
          const fetchUsuarios = async () => {
            try {
              const response = await axios.get('http://localhost:3001/user', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsuarios(response.data);
            } catch (error) {
              console.error("Erro ao buscar usuarios:", error);
            }
          };
          fetchUsuarios();
        }
      }
      else{
        router.push("/login")
      }
      }, []);

    const Excluir = (id) => {
      try {
        axios.delete('http://localhost:3001/user/'+id, {
          headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL)}` },
        });
        router.push('/');

      } catch (error) {
        console.error("Erro ao excluir usuarios:", error);
      }
    }

    const handleFilterChange = (e) => {
      setFiltro(e.target.value);
    };

    const filteredUsers = Usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(filtro.toLowerCase()) || 
    usuario.id.toString().includes(filtro)
  );
  const mostrarMaisUsuarios = () => {
    setExibirMais(true);
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.logo}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href="/">
            <span className={styles.gus}>Gus</span>
            <span className={styles.alert}>Alert</span>
        </Link>
      </motion.div>

      <h1 className={styles.title}>Usuários</h1>
      <input
        type="text"
        placeholder="Filtrar usuários..."
        value={filtro}
        onChange={handleFilterChange}
        className={styles.filterInput}
      />

      <div>
      {filteredUsers.length === 0 ? (
          <p>Nenhum usuario encontrado.</p>
        ) : (
        filteredUsers.slice(0, exibirMais ? filteredUsers.length : 8).map((usuario) => (
          <motion.div
            key={usuario.id}
            className={styles.Containerblock}
          >
            <h2>{usuario.nome}</h2>
            <p>{usuario.email}</p>
            <p>{usuario.telefone}</p>
            <p className={styles.excluir} onClick={() => Excluir(usuario.id)}>
              Excluir
            </p>
          </motion.div>
        ))
        )}
        {filteredUsers.length > 8 && !exibirMais && (
          <button onClick={mostrarMaisUsuarios} className={styles.verMaisButton}>Ver Mais</button>
        )}
      </div>
    </div>
    )

}
export default Usuarios