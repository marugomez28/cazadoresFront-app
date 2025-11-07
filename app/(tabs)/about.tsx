import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { useHunterContext } from '../context/HunterContext';
import { huntersNoRelacionalesAPI, Hunter } from '../services/api';

export default function About() {
  const {
    huntersNoRelacionales,
    setHuntersNoRelacionales,
    hunterNoRelacionalSeleccionado,
    setHunterNoRelacionalSeleccionado,
  } = useHunterContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para nuevo/editar hunter
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    altura: '',
    peso: '',
    imageurl: '',
    descripcion: '',
  });

  // Cargar todos los hunters al iniciar
  useEffect(() => {
    cargarHunters();
  }, []);

  const cargarHunters = async () => {
    try {
      setLoading(true);
      const hunters = await huntersNoRelacionalesAPI.getAll();
      setHuntersNoRelacionales(hunters);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los hunters de la base no relacional');
    } finally {
      setLoading(false);
    }
  };

  const buscarHunter = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre');
      return;
    }

    try {
      setLoading(true);
      const hunter = await huntersNoRelacionalesAPI.getByName(searchTerm);
      setHunterNoRelacionalSeleccionado(hunter);
      Alert.alert('Éxito', 'Personaje encontrado en BD No Relacional');
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Personaje no encontrado en la base no relacional');
    } finally {
      setLoading(false);
    }
  };

  const crearHunter = async () => {
    if (!formData.nombre || !formData.imageurl) {
      Alert.alert('Error', 'Nombre e imagen son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const nuevoHunter = {
        nombre: formData.nombre,
        edad: formData.edad ? parseInt(formData.edad) : undefined,
        altura: formData.altura || undefined,
        peso: formData.peso || undefined,
        imageurl: formData.imageurl,
        descripcion: formData.descripcion || undefined,
      };

      await huntersNoRelacionalesAPI.create(nuevoHunter);
      Alert.alert('Éxito', 'Hunter creado correctamente en BD No Relacional');
      setCreateModalVisible(false);
      resetForm();
      cargarHunters();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear hunter en BD No Relacional');
    } finally {
      setLoading(false);
    }
  };

  const actualizarHunter = async () => {
    if (!hunterNoRelacionalSeleccionado || !hunterNoRelacionalSeleccionado.id) return;

    try {
      setLoading(true);
      const datosActualizados = {
        nombre: formData.nombre,
        edad: formData.edad ? parseInt(formData.edad) : undefined,
        altura: formData.altura || undefined,
        peso: formData.peso || undefined,
        imageurl: formData.imageurl,
        descripcion: formData.descripcion || undefined,
      };

      await huntersNoRelacionalesAPI.update(hunterNoRelacionalSeleccionado.nombre, datosActualizados);
      Alert.alert('Éxito', 'Hunter actualizado correctamente en BD No Relacional');
      setEditModalVisible(false);
      resetForm();
      cargarHunters();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar hunter en BD No Relacional');
    } finally {
      setLoading(false);
    }
  };

  const eliminarHunter = async (id: string, nombre: string) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de eliminar a ${nombre} de la base no relacional?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await huntersNoRelacionalesAPI.delete(id);
              Alert.alert('Éxito', 'Hunter eliminado correctamente de BD No Relacional');
              cargarHunters();
              if (modalVisible) setModalVisible(false);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar hunter de BD No Relacional');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      edad: '',
      altura: '',
      peso: '',
      imageurl: '',
      descripcion: '',
    });
  };

  const abrirModalEditar = (hunter: Hunter) => {
    setHunterNoRelacionalSeleccionado(hunter);
    setFormData({
      nombre: hunter.nombre,
      edad: hunter.edad?.toString() || '',
      altura: hunter.altura || '',
      peso: hunter.peso || '',
      imageurl: hunter.imageurl,
      descripcion: hunter.descripcion || '',
    });
    setEditModalVisible(true);
  };

  const renderHunterItem = ({ item }: { item: Hunter }) => (
    <TouchableOpacity
      style={styles.hunterCard}
      onPress={() => {
        setHunterNoRelacionalSeleccionado(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.imageurl }} style={styles.hunterImage} />
      <View style={styles.hunterInfo}>
        <Text style={styles.hunterName}>{item.nombre}</Text>
        <Text style={styles.hunterDetails}>Edad: {item.edad || 'N/A'}</Text>
        <Text style={styles.databaseTag}>No Relacional</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => abrirModalEditar(item)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => eliminarHunter(item.id!, item.nombre)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hunter x Hunter - BD No Relacional</Text>
      <Text style={styles.subtitle}>MongoDB / NoSQL Database</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personaje por nombre..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarHunter}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para crear nuevo hunter */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+ Nuevo Hunter (NoSQL)</Text>
      </TouchableOpacity>

      {/* Lista de hunters */}
      <FlatList
        data={huntersNoRelacionales}
        renderItem={renderHunterItem}
        keyExtractor={(item) => item.id || item.nombre}
        refreshing={loading}
        onRefresh={cargarHunters}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay hunters en la base de datos no relacional
          </Text>
        }
      />

      {/* Modal para ver detalles */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {hunterNoRelacionalSeleccionado && (
            <>
              <Text style={styles.modalTitle}>{hunterNoRelacionalSeleccionado.nombre}</Text>
              <Text style={styles.databaseBadge}>BASE DE DATOS NO RELACIONAL</Text>
              <Image
                source={{ uri: hunterNoRelacionalSeleccionado.imageurl }}
                style={styles.modalImage}
              />
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalText}>
                  <Text style={styles.label}>Edad:</Text> {hunterNoRelacionalSeleccionado.edad || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.label}>Altura:</Text> {hunterNoRelacionalSeleccionado.altura || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.label}>Peso:</Text> {hunterNoRelacionalSeleccionado.peso || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.label}>Descripción:</Text> 
                </Text>
                <Text style={styles.descriptionText}>
                  {hunterNoRelacionalSeleccionado.descripcion || 'No hay descripción disponible'}
                </Text>
                {hunterNoRelacionalSeleccionado.id && (
                  <Text style={styles.idText}>
                    <Text style={styles.label}>ID:</Text> {hunterNoRelacionalSeleccionado.id}
                  </Text>
                )}
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => {
                    setModalVisible(false);
                    abrirModalEditar(hunterNoRelacionalSeleccionado);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Modal para crear hunter */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear Nuevo Hunter</Text>
          <Text style={styles.modalSubtitle}>Base de Datos No Relacional</Text>
          <ScrollView style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={formData.edad}
              onChangeText={(text) => setFormData({ ...formData, edad: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Altura (ej: 160 cm)"
              value={formData.altura}
              onChangeText={(text) => setFormData({ ...formData, altura: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso (ej: 50 kg)"
              value={formData.peso}
              onChangeText={(text) => setFormData({ ...formData, peso: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de imagen *"
              value={formData.imageurl}
              onChangeText={(text) => setFormData({ ...formData, imageurl: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={formData.descripcion}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              multiline
              numberOfLines={3}
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={crearHunter}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creando...' : 'Crear en NoSQL'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para editar hunter */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar {hunterNoRelacionalSeleccionado?.nombre}</Text>
          <Text style={styles.modalSubtitle}>Base de Datos No Relacional</Text>
          <ScrollView style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={formData.edad}
              onChangeText={(text) => setFormData({ ...formData, edad: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Altura (ej: 160 cm)"
              value={formData.altura}
              onChangeText={(text) => setFormData({ ...formData, altura: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso (ej: 50 kg)"
              value={formData.peso}
              onChangeText={(text) => setFormData({ ...formData, peso: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de imagen *"
              value={formData.imageurl}
              onChangeText={(text) => setFormData({ ...formData, imageurl: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={formData.descripcion}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              multiline
              numberOfLines={3}
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={actualizarHunter}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Actualizando...' : 'Actualizar en NoSQL'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c5530',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4a7c59',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4a7c59',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#4a7c59',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#2c5530',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  hunterCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  hunterImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  hunterInfo: {
    flex: 1,
    marginLeft: 15,
  },
  hunterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c5530',
  },
  hunterDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  databaseTag: {
    fontSize: 12,
    color: '#4a7c59',
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  closeButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c5530',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4a7c59',
    fontWeight: '600',
  },
  databaseBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4a7c59',
    backgroundColor: '#e8f5e8',
    padding: 5,
    borderRadius: 4,
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  label: {
    fontWeight: 'bold',
    color: '#2c5530',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  idText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4a7c59',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});