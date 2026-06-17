import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
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

        <div className="form-contain"></div>

        <div className="form-container">
          <IonInput
            className='form-field'
            label="Nombre del repositorio"
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            fill='outline'
            />
          <IonTextarea
            className='form-field'
            label='Descripcion del repositorio'
            labelPlacement='floating'
            placeholder='Ingrese la descripcion'
            rows={6}
            fill='outline'
          />
          <IonButton
            className='form-field'
            expand='block'
            color="dark"
            shape='round'
          >
            Guardar  
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;