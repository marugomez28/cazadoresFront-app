const BASE_URL_RELACIONAL = 'https://cazadoresbackendsql-production.up.railway.app/api/hunters-relacionales';
const BASE_URL_NO_RELACIONAL = 'https://cazadoresbackendnosql-production.up.railway.app'; 

export interface Hunter {
  id?: string;
  _id?: string;
  nombre: string;
  edad?: number;
  altura?: string;
  peso?: string;
  imageurl: string;    
  imageUrl?: string;   
  descripcion?: string; 
  description?: string; 
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
}


export const huntersRelacionalesAPI = {

  getAll: async (): Promise<Hunter[]> => {
    try {
      const response = await fetch(BASE_URL_RELACIONAL);
      if (!response.ok) throw new Error('Error al obtener hunters');
      return await response.json();
    } catch (error) {
      console.error('Error fetching hunters relacionales:', error);
      throw error;
    }
  },

  getByName: async (nombre: string): Promise<Hunter> => {
    try {
      const response = await fetch(`${BASE_URL_RELACIONAL}/${encodeURIComponent(nombre)}`);
      if (!response.ok) throw new Error('Hunter no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error fetching hunter:', error);
      throw error;
    }
  },

  create: async (hunter: Omit<Hunter, 'id' | 'created_at'>): Promise<Hunter> => {
    try {
      const response = await fetch(BASE_URL_RELACIONAL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hunter),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear hunter');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating hunter:', error);
      throw error;
    }
  },

  update: async (nombre: string, hunter: Partial<Hunter>): Promise<Hunter> => {
    try {
      const response = await fetch(`${BASE_URL_RELACIONAL}/${encodeURIComponent(nombre)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hunter),
      });
      
      if (!response.ok) throw new Error('Error al actualizar hunter');
      return await response.json();
    } catch (error) {
      console.error('Error updating hunter:', error);
      throw error;
    }
  },

  delete: async (nombre: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL_RELACIONAL}/${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar hunter');
    } catch (error) {
      console.error('Error deleting hunter:', error);
      throw error;
    }
  },
};

export const huntersNoRelacionalesAPI = {
  getAll: async (): Promise<Hunter[]> => {
    try {
      const response = await fetch(`${BASE_URL_NO_RELACIONAL}/characters`);
      if (!response.ok) throw new Error('Error al obtener hunters no relacionales');
      const data = await response.json();
      
      return data.map((hunter: any) => ({
        id: hunter._id,
        _id: hunter._id,
        nombre: hunter.nombre,
        edad: hunter.edad,
        altura: hunter.altura,
        peso: hunter.peso,
        imageurl: hunter.imageUrl,
        descripcion: hunter.description,
        createdAt: hunter.createdAt,
        updatedAt: hunter.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching hunters no relacionales:', error);
      throw error;
    }
  },

  getByName: async (nombre: string): Promise<Hunter> => {
    try {
      const response = await fetch(`${BASE_URL_NO_RELACIONAL}/characters/${encodeURIComponent(nombre)}`);
      if (!response.ok) throw new Error('Hunter no encontrado en base no relacional');
      const hunter = await response.json();
      
      return {
        id: hunter._id,
        _id: hunter._id,
        nombre: hunter.nombre,
        edad: hunter.edad,
        altura: hunter.altura,
        peso: hunter.peso,
        imageurl: hunter.imageUrl,
        descripcion: hunter.description,
        createdAt: hunter.createdAt,
        updatedAt: hunter.updatedAt
      };
    } catch (error) {
      console.error('Error fetching hunter no relacional:', error);
      throw error;
    }
  },

  create: async (hunter: Omit<Hunter, 'id' | 'created_at' | '_id'>): Promise<Hunter> => {
    try {
      const hunterData = {
        nombre: hunter.nombre,
        edad: hunter.edad,
        altura: hunter.altura,
        peso: hunter.peso,
        imageUrl: hunter.imageurl,
        description: hunter.descripcion
      };

      console.log('Creando hunter con datos:', hunterData);

      const response = await fetch(`${BASE_URL_NO_RELACIONAL}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hunterData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear hunter en base no relacional');
      }
      
      const newHunter = await response.json();
      console.log('Hunter creado:', newHunter);
      
      return {
        id: newHunter._id,
        _id: newHunter._id,
        nombre: newHunter.nombre,
        edad: newHunter.edad,
        altura: newHunter.altura,
        peso: newHunter.peso,
        imageurl: newHunter.imageUrl,
        descripcion: newHunter.description,
        createdAt: newHunter.createdAt,
        updatedAt: newHunter.updatedAt
      };
    } catch (error) {
      console.error('Error creating hunter no relacional:', error);
      throw error;
    }
  },

 update: async (nombre: string, hunter: Partial<Hunter>): Promise<Hunter> => {
  try {
    const hunterData: any = {};
    if (hunter.edad !== undefined) hunterData.edad = hunter.edad;
    if (hunter.altura !== undefined) hunterData.altura = hunter.altura;
    if (hunter.peso !== undefined) hunterData.peso = hunter.peso;
    if (hunter.imageurl !== undefined) hunterData.imageUrl = hunter.imageurl;
    if (hunter.descripcion !== undefined) hunterData.description = hunter.descripcion;

    console.log('Actualizando hunter por NOMBRE:', nombre, hunterData);

    const response = await fetch(`${BASE_URL_NO_RELACIONAL}/characters/${encodeURIComponent(nombre)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hunterData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const updatedHunter = await response.json();
    console.log('Hunter actualizado:', updatedHunter);
    
    if (!updatedHunter) {
      throw new Error('El backend retornó null - probablemente el personaje no fue encontrado');
    }
    
    return {
      id: updatedHunter._id,
      _id: updatedHunter._id,
      nombre: updatedHunter.nombre,
      edad: updatedHunter.edad,
      altura: updatedHunter.altura,
      peso: updatedHunter.peso,
      imageurl: updatedHunter.imageUrl,
      descripcion: updatedHunter.description,
      createdAt: updatedHunter.createdAt,
      updatedAt: updatedHunter.updatedAt
    };
  } catch (error) {
    console.error('Error updating hunter no relacional:', error);
    throw error;
  }
},
  delete: async (nombre: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL_NO_RELACIONAL}/characters/${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar hunter de base no relacional');
    } catch (error) {
      console.error('Error deleting hunter no relacional:', error);
      throw error;
    }
  },
};