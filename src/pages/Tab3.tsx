import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab3.css";

const Tab3: React.FC = () => {
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
          <IonCard className="card">
            <img
              src="https://avatars.githubusercontent.com/u/1024"
              alt="avatarlobo"
            />

            {/* IonCardHeader - Sirve para poner como si fuera un card */}
            <IonCardHeader>
              <IonCardTitle>Sebastián Rojas</IonCardTitle>
              <IonCardSubtitle>Lobo.ph_</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>Desarrollador de Software, me gusta conducir, las mujeres, los videojuegos y el anime.</IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
