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
} from "@ionic/react";
// import { repositoryList } from "../interfaces/Repository";
import RepoItem from "../components/RepoItem";
import { Repository } from "../interfaces/Repository";
import { fetchRepositories } from "../services/GitHubService";
import "./Tab1.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Tab1: React.FC = () => {
  const [repositoryList, setRepositoryList] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const loadRepos = async () => {
    setLoading(true);
    fetchRepositories()
      .then((reposData) => setRepositoryList(reposData))
      .catch((error) => setErrorMsg("Error al cargar repositorios. " + error))
      .finally(() => setLoading(false));
  };

  // Cargar los repositorios cada vez que se entra a la vista
  useIonViewWillEnter(() => {
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        {/*Android*/}

        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          {/*iOS */}
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {repositoryList.map((repo) => (
            <RepoItem {...repo} />
          ))}
        </IonList>
        {loading && <LoadingSpinner />}
        {errorMsg !== "" && (
          <IonText color="danger">
            <p>{errorMsg} </p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
