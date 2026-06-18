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
import { Repository } from "../interfaces/Repository.js";

const RepoItem: React.FC<Repository> = (repository) => {
  return (
    <IonItemSliding>
      <IonItem>
        <IonThumbnail slot="start">
          <img src={repository.owner.avatar_url} alt={repository.name} />
        </IonThumbnail>
        <IonLabel>
          <h3>{repository.name}</h3>
          <p>{repository.description}</p>
          {repository.language !== null && repository.language !== "" && (
            <span className="repo-language">{repository.language}</span>
          )}
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
