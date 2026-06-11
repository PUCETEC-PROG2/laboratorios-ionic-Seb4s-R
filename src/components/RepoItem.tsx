import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import "./RepoItem.tsx";
import React from "react";
import { pencil, trash } from "ionicons/icons";
import { Repository } from "../interfaces/Repository.js";


const RepoItem: React.FC<Repository> = (repository) => {
  return (
    <IonItemSliding>
      <IonItem>
        <IonThumbnail slot="start">
          <img src={repository.avatarUrl} alt={repository.name} />
        </IonThumbnail>
        <IonLabel>
          <h3>{repository.name}</h3>
          <p>{repository.description}</p>
          <p>
            <strong>Lenguaje: </strong>
            {repository.languaje}
          </p>
        </IonLabel>
      </IonItem>
      <IonItemOptions>
        <IonItemOption color={"warning"}>
          <IonIcon icon={pencil} slot="icon-only" />
        </IonItemOption>
        <IonItemOption color={"danger"}>
          <IonIcon icon={trash} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default RepoItem;
