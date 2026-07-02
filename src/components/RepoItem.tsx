import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import "./RepoItem.css";
import React from "react";
import { pencil, trash } from "ionicons/icons";
import { Repository } from "../interfaces/Repository";

// Definición de las propiedades que recibirá el componente RepoItem
// Extiende la interfaz Repository para incluir los callbacks de edición y eliminación
interface RepoItemProps extends Repository {
  onEdit: () => void;     // Función callback que se ejecuta al presionar editar
  onDelete: () => void;   // Función callback que se ejecuta al presionar eliminar
}

/**
 * Componente que representa un ítem de repositorio en una lista deslizable (sliding).
 * Permite deslizar hacia la izquierda para revelar opciones de edición y eliminación.
 */
const RepoItem: React.FC<RepoItemProps> = ({ onEdit, onDelete, ...repository }) => {
  return (
    <IonItemSliding>
      {/* Contenido principal del ítem */}
      <IonItem>
        <IonThumbnail slot="start">
          <img src={repository.owner.avatar_url} alt={repository.name} />
        </IonThumbnail>
        <IonLabel>
          <h3>{repository.name}</h3>
          <p>{repository.description}</p>
          {/* Muestra el lenguaje de programación si está disponible */}
          {repository.language !== null && repository.language !== "" && (
            <span className="repo-language">{repository.language}</span>
          )}
        </IonLabel>
      </IonItem>

      {/* Opciones deslizables que aparecen al arrastrar el ítem */}
      <IonItemOptions side="end">
        {/* Opción de Editar: botón de cristal verde/cian */}
        <IonItemOption className="edit-option" onClick={onEdit}>
          <IonIcon icon={pencil} slot="icon-only" />
        </IonItemOption>
        
        {/* Opción de Eliminar: botón de cristal rojo */}
        <IonItemOption className="delete-option" onClick={onDelete}>
          <IonIcon icon={trash} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default RepoItem;

