import React, {useState} from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter, } from "@ionic/react";
import "./Tab3.css";
import { fetchUserInfo } from "../services/GitHubService";
import { GithubUser } from "../interfaces/GithubUser";
import LoadingSpinner from "../components/LoadingSpinner";
// < >

const Tab3: React.FC = () => {

const [loading, setLoading]= useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [userInfo, setUserInfo]= useState<GithubUser | null>(null);

  useIonViewWillEnter(() => {
    setLoading(true);
    fetchUserInfo()
      .then((githubUser) => setUserInfo(githubUser))
      .catch((error) => setErrorMsg("Error al cargar usuario. " + error))
      .finally(() => setLoading(false));
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de Usuario</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="card-container">
          {userInfo && (
            <IonCard className="card">
            <img
              src={userInfo.avatar_url}
              alt={userInfo.login}
            />

            {/* IonCardHeader - Sirve para poner como si fuera un card */}
            <IonCardHeader>
              <IonCardTitle>{userInfo.name}</IonCardTitle>
              <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{userInfo.bio}</IonCardContent>
          </IonCard>
        )}
        {errorMsg !== "" && (
          <IonText color="danger">
            <p>{errorMsg}</p>
          </IonText>
        )}
        </div>
        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
