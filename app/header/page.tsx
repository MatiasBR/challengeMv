
import React from 'react';
import { SiLangchain, SiOllama } from 'react-icons/si';  // Importing icons for Langchain.js and Ollama
import styles from '../styles/header.module.css'; 

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Langchain.js Icon and Text */}
        <div className={styles.item}>
          <SiLangchain size={30} className={styles.icon} />
          <span className={styles.text}>Langchain.js</span>
        </div>

        {/* Ollama Icon and Text */}
        <div className={styles.item}>
          <SiOllama size={30} className={styles.icon} />
          <span className={styles.text}>Ollama</span>
        </div>
      </div>
    </header>
  );
};


export default Header;
