import { ViewChild, ElementRef, Component, signal } from '@angular/core';
import {
  IonCardContent, IonButton, IonList, IonItem, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonIcon, IonCard,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PercentPipe } from '@angular/common';

import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';

import { TeachablemachineService } from '../services/teachablemachine.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    PercentPipe,
    IonCardContent, IonButton, IonList, IonItem, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,
    IonFab, IonFabButton, IonIcon, IonCard
  ],
})
export class Tab1Page {

  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false);
  imageUrl = signal('');

  modelLoaded = signal(false);
  classLabels: string[] = [];

  constructor(private teachablemachine: TeachablemachineService) {
    addIcons({ cloudUploadOutline });
  }

  async ngOnInit() {
    await this.teachablemachine.loadModel()
    this.classLabels = this.teachablemachine.getClassLabels()
    this.modelLoaded.set(true)
  }

  /* El método onSubmit para enviar los datos del formulario mediante el servicio */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();

      // Convertir el archivo a una URL base64 para mostrarlo en el html
      reader.onload = () => {
        this.imageUrl.set(reader.result as string)
        this.imageReady.set(true)
      };

      reader.readAsDataURL(file); // Leer el archivo como base64
    }
  }

  predictions: any[] = [];
  async predict() {
    try {
      const image = this.imageElement.nativeElement;
      this.predictions = await this.teachablemachine.predict(image);
    } catch (error) {
      console.error(error);
      alert('Error al realizar la predicción.');
    }
  }

}
