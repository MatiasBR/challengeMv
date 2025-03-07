
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // Usar ts-jest para TypeScript
  testEnvironment: 'node', // Entorno de pruebas (node para backend)
  moduleFileExtensions: ['ts', 'tsx', 'js'], // Extensiones de archivos que Jest manejará
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transformar archivos TypeScript
  },
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'], // Patrón para encontrar archivos de prueba
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Mapear alias de importaciones (si usas alias en tu proyecto)
  },
};

export default config;