import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // Hook para manejo del historial de navegación
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";
import { Repository } from "../interfaces/Repository";
import "./Tab2.css";
import { createRepository, updateRepository } from "../services/GitHubService"; // Servicios API REST para POST y PATCH
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Componente Tab2 que sirve como formulario tanto para la creación (POST) como
 * para la edición/actualización parcial (PATCH) de repositorios en GitHub.
 */
const Tab2: React.FC = () => {
  const history = useHistory();

  // Estados locales para controlar si estamos en modo edición y almacenar el repo seleccionado
  const [isEditing, setIsEditing] = useState(false);
  const [repoToEdit, setRepoToEdit] = useState<Repository | null>(null);

  // Estado que almacena la información del formulario
  const [repositoryData, setRepositoryData] = useState<RepositoryPayload>({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga
  const [errorMsg, setErrorMsg] = useState(""); // Estado para mostrar mensajes de error de la API

  /**
   * Guarda o actualiza la información del repositorio en GitHub.
   */
  const saveRepo = async () => {
    // Validación básica en el frontend
    if (repositoryData.name.trim() === "") {
      setErrorMsg("El nombre del repositorio es obligatorio");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");

    try {
      if (isEditing && repoToEdit) {
        // Modo Edición: Lógica de actualización (petición PATCH)
        await updateRepository(repoToEdit.owner.login, repoToEdit.name, repositoryData);
      } else {
        // Modo Creación: Lógica de guardado (petición POST)
        await createRepository(repositoryData);
      }

      // Reinicia los campos del formulario tras la operación exitosa
      setRepositoryData({
        name: "",
        description: "",
      });
      
      // Limpia los estados locales de edición
      setIsEditing(false);
      setRepoToEdit(null);
      
      // Limpia el estado del history para evitar que se quede en modo edición al volver a entrar
      history.replace({ state: {} });
      
      // Redirige al listado en Tab1
      history.push("/tab1");
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el repositorio:`, error);
      setErrorMsg(`Error al ${isEditing ? 'actualizar' : 'crear'} el repositorio: ` + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancela la edición activa, limpia los campos del formulario y regresa al listado de repositorios.
   */
  const cancelEdit = () => {
    // Restablece los datos del formulario a su estado vacío
    setRepositoryData({
      name: "",
      description: "",
    });
    // Limpia el estado local de edición
    setIsEditing(false);
    setRepoToEdit(null);
    // Limpia el state de navegación del historial para que no se re-active al volver a entrar
    history.replace({ state: {} });
    // Redirige al usuario de vuelta a la pestaña Tab1
    history.push("/tab1");
  };

  /**
   * Ciclo de vida de Ionic: Se ejecuta garantizadamente cada vez que la vista entra en pantalla.
   * Usamos esto para leer los datos del repositorio a editar e inicializar o limpiar el formulario.
   */
  useIonViewWillEnter(() => {
    setErrorMsg("");
    
    // Leemos el estado directamente de history.location para garantizar acceso al valor más reciente
    const state = history.location.state as { repoToEdit?: Repository } | undefined;
    const repo = state?.repoToEdit;
    
    if (repo) {
      // Si la navegación nos provee un repositorio, entramos en modo edición
      setIsEditing(true);
      setRepoToEdit(repo);
      setRepositoryData({
        name: repo.name,
        description: repo.description || "",
      });
    } else {
      // Si no hay repositorio en el estado, limpiamos el formulario para modo creación
      setIsEditing(false);
      setRepoToEdit(null);
      setRepositoryData({
        name: "",
        description: "",
      });
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Cambia dinámicamente el título según el estado de la vista */}
          <IonTitle>{isEditing ? "Editar Repositorio" : "Formulario de Repositorio"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              {isEditing ? "Editar Repositorio" : "Formulario de Repositorio"}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="form-container">
          {/* Entrada de texto para el nombre del repositorio */}
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            fill="outline"
            value={repositoryData.name}
            onIonChange={(e) =>
              setRepositoryData({ ...repositoryData, name: e.detail.value ?? "" })
            }
          />
          
          {/* Entrada de texto multilínea para la descripción */}
          <IonTextarea
            className="form-field"
            label="Descripción del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese la descripción"
            value={repositoryData.description}
            onIonChange={(e) =>
              setRepositoryData({
                ...repositoryData,
                description: e.detail.value ?? "",
              })
            }
            rows={6}
            fill="outline"
          />

          {/* Muestra los errores generados */}
          {errorMsg !== "" && (
            <IonText color="danger">
              <p>{errorMsg}</p>
            </IonText>
          )}

          {/* Botón de acción */}
          <IonButton
            className="form-field"
            expand="block"
            color="dark"
            shape="round"
            disabled={loading}
            onClick={saveRepo}
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
          </IonButton>

          {/* Botón de Cancelar Edición (solo visible si estamos editando un repositorio existente) */}
          {isEditing && (
            <IonButton
              className="form-field"
              expand="block"
              color="medium"
              fill="outline"
              shape="round"
              disabled={loading}
              onClick={cancelEdit}
              style={{ marginTop: "12px" }}
            >
              Cancelar Edición
            </IonButton>
          )}
        </div>

        {/* Spinner de carga overlay */}
        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;


