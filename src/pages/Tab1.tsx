import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  useIonViewWillEnter,
  IonText,
  IonAlert, // Componente IonAlert para desplegar ventanas emergentes desde el JSX
} from "@ionic/react";
import { useHistory } from "react-router-dom"; // Hook para la navegación entre páginas
import RepoItem from "../components/RepoItem";
import { Repository } from "../interfaces/Repository";
import { fetchRepositories, deleteRepository } from "../services/GitHubService"; // Importación de servicios API REST
import "./Tab1.css";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Página principal (Tab1) que muestra la lista de repositorios del usuario de GitHub.
 * Permite recargar la lista al entrar, iniciar el flujo de edición y el flujo de eliminación.
 */
const Tab1: React.FC = () => {
  const history = useHistory(); // Instancia para manejar el historial de navegación
  const [repositoryList, setRepositoryList] = React.useState<Repository[]>([]); // Estado que almacena la lista de repositorios
  const [loading, setLoading] = React.useState(false); // Estado para controlar el spinner de carga
  const [errorMsg, setErrorMsg] = React.useState(""); // Estado para almacenar mensajes de error de la API

  // Estados para controlar la visibilidad del modal de alerta y almacenar los datos del repositorio a eliminar
  const [showAlert, setShowAlert] = React.useState(false);
  const [repoToDelete, setRepoToDelete] = React.useState<{ owner: string; name: string } | null>(null);

  /**
   * Carga los repositorios llamando al servicio REST GET de GitHub.
   */
  const loadRepos = async () => {
    setLoading(true);
    setErrorMsg("");
    fetchRepositories()
      .then((reposData) => setRepositoryList(reposData))
      .catch((error) => {
        console.error("Error al cargar los repositorios:", error);
        setErrorMsg("Error al cargar repositorios. " + (error instanceof Error ? error.message : String(error)));
      })
      .finally(() => setLoading(false));
  };

  // Carga los repositorios automáticamente cada vez que la pestaña/vista se vuelve activa
  useIonViewWillEnter(() => {
    loadRepos();
  });

  /**
   * Ejecuta el método DELETE de la API de GitHub a través del servicio.
   * Al finalizar con éxito, recarga la lista.
   */
  const handleDelete = async (owner: string, repoName: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Llamada al método DELETE expuesto en GitHubService
      await deleteRepository(owner, repoName);
      loadRepos(); // Recargar la lista para reflejar que fue eliminado
    } catch (error) {
      console.error("Error al eliminar el repositorio:", error);
      setErrorMsg("Error al eliminar: " + (error instanceof Error ? error.message : String(error)));
      setLoading(false);
    }
  };

  /**
   * Redirige al usuario al formulario de edición en la pestaña Tab2.
   * Pasa el repositorio seleccionado mediante el estado de navegación.
   */
  const handleEdit = (repo: Repository) => {
    history.push({
      pathname: "/tab2",
      state: { repoToEdit: repo }, // Estado que recibe Tab2 para saber que está editando
    });
  };

  /**
   * Abre la confirmación de eliminación guardando los datos del repositorio seleccionado.
   */
  const confirmDelete = (owner: string, repoName: string) => {
    setRepoToDelete({ owner, name: repoName });
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        {/* Barra de herramientas para plataformas como Android */}
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          {/* Título colapsable adaptado para el diseño de iOS */}
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Spinner de carga que bloquea la pantalla mientras se realizan peticiones */}
        {loading && <LoadingSpinner />}

        {/* Lista de repositorios cargada exitosamente */}
        {!loading && repositoryList.length > 0 && (
          <IonList>
            {repositoryList.map((repo) => (
              <RepoItem 
                key={repo.name} 
                {...repo} 
                onEdit={() => handleEdit(repo)} // Callback para el evento de edición
                onDelete={() => confirmDelete(repo.owner.login, repo.name)} // Callback para confirmación de borrado
              />
            ))}
          </IonList>
        )}

        {/* Mensaje que se despliega si existe algún error en las peticiones REST */}
        {!loading && errorMsg !== "" && (
          <IonText color="danger">
            <p style={{ textAlign: "center", fontWeight: "bold" }}>{errorMsg}</p>
          </IonText>
        )}

        {/* Componente Alert inyectado en el JSX para interpretación nativa de HTML */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            setRepoToDelete(null);
          }}
          header="Confirmar eliminación"
          // La propiedad message procesa el HTML de forma directa sin requerir IonicSafeString
          message={`¿Estás seguro de que deseas eliminar el repositorio: "${repoToDelete?.name}"? Esta acción borrará todo el contenido de forma permanente en GitHub.`}
          cssClass="custom-delete-alert" // Aplica la clase con el formato premium
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              cssClass: "alert-button-cancel", // Estilos del botón Cancelar
            },
            {
              text: "Sí, eliminar",
              role: "confirm",
              cssClass: "alert-button-confirm", // Estilos del botón Confirmar
              handler: () => {
                if (repoToDelete) {
                  handleDelete(repoToDelete.owner, repoToDelete.name);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
