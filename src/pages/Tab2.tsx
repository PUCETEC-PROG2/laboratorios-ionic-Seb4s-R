import { useState } from "react";
import { useHistory } from "react-router";
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
import "./Tab2.css";
import { createRepository } from "../services/GitHubService";

const Tab2: React.FC = () => {
  const history = useHistory();
  const [repositoryData, setRepositoryData] = useState<RepositoryPayload>({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const saveRepo = () => {
    if (repositoryData.name.trim() === "") {
      setErrorMsg("El nombre del repositorio es obligatorio");
      return;
    }
    setLoading(true);
    createRepository(repositoryData)
      .then(() => history.push("/tab1"))
      .catch((error) => setErrorMsg("Error al crear repositorio. " + error))
      .finally(() => {
        setLoading(false);
        setRepositoryData({
          name: "",
          description:""
        });
      });
  };

  useIonViewWillEnter(() => {
    setErrorMsg("");
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="form-container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            fill="outline"
            value={repositoryData.name}
            onIonChange={(e) =>
              setRepositoryData({ ...repositoryData, name: e.detail.value! })
            }
          />
          <IonTextarea
            className="form-field"
            label="Descripcion del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese la descripcion"
            value={repositoryData.description}
            onIonChange={(e) =>
              setRepositoryData({
                ...repositoryData,
                description: e.detail.value!,
              })
            }
            rows={6}
            fill="outline"
          />
          {errorMsg !== "" && (
            <IonText color="danger">
              <p>{errorMsg}</p>
            </IonText>
          )}
          <IonButton
            className="form-field"
            expand="block"
            color="dark"
            shape="round"
            disabled={loading}
            onClick={saveRepo}
          >
            {loading ? "Guardando..." : "Guardar"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
