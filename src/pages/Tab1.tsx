import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList
} from "@ionic/react";
import "./Tab1.css";
import { repositoryList } from "../interfaces/Repository";
import RepoItem from "../components/RepoItem";

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        {/*Android*/}

        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
      
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
