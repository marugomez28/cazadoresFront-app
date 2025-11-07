import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Hunter {
  id?: string;
  nombre: string;
  edad?: number;
  altura?: string;
  peso?: string;
  imageurl: string;
  descripcion?: string;
  created_at?: string;
}

interface HunterContextType {
  // Estados para base de datos relacional
  huntersRelacionales: Hunter[];
  hunterSeleccionado: Hunter | null;
  
  // Estados para base de datos no relacional
  huntersNoRelacionales: Hunter[];
  hunterNoRelacionalSeleccionado: Hunter | null;
  
  // Funciones para relacional
  setHuntersRelacionales: (hunters: Hunter[]) => void;
  setHunterSeleccionado: (hunter: Hunter | null) => void;
  
  // Funciones para no relacional
  setHuntersNoRelacionales: (hunters: Hunter[]) => void;
  setHunterNoRelacionalSeleccionado: (hunter: Hunter | null) => void;
  
  // Estado para controlar qué base de datos estamos usando
  baseDeDatosActiva: 'relacional' | 'no-relacional';
  setBaseDeDatosActiva: (base: 'relacional' | 'no-relacional') => void;
}

const HunterContext = createContext<HunterContextType | undefined>(undefined);

export const HunterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [huntersRelacionales, setHuntersRelacionales] = useState<Hunter[]>([]);
  const [hunterSeleccionado, setHunterSeleccionado] = useState<Hunter | null>(null);
  const [huntersNoRelacionales, setHuntersNoRelacionales] = useState<Hunter[]>([]);
  const [hunterNoRelacionalSeleccionado, setHunterNoRelacionalSeleccionado] = useState<Hunter | null>(null);
  const [baseDeDatosActiva, setBaseDeDatosActiva] = useState<'relacional' | 'no-relacional'>('relacional');

  return (
    <HunterContext.Provider
      value={{
        huntersRelacionales,
        hunterSeleccionado,
        huntersNoRelacionales,
        hunterNoRelacionalSeleccionado,
        setHuntersRelacionales,
        setHunterSeleccionado,
        setHuntersNoRelacionales,
        setHunterNoRelacionalSeleccionado,
        baseDeDatosActiva,
        setBaseDeDatosActiva,
      }}
    >
      {children}
    </HunterContext.Provider>
  );
};

export const useHunterContext = () => {
  const context = useContext(HunterContext);
  if (context === undefined) {
    throw new Error('useHunterContext debe ser usado dentro de un HunterProvider');
  }
  return context;
};