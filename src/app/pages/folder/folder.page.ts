import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonSelect,
  IonCard,
  IonSelectOption,
  IonCardHeader,
  IonCardContent,
  IonBadge,
  IonInput,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventService } from '../../services/event.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  calendarSharp,
  calendarClearOutline,
  closeCircleOutline,
  timeOutline,
  locationOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { NgxPaginationModule } from 'ngx-pagination';

export interface Evento {
  id_evento: number;
  id_equipo_local: number;
  id_equipo_visitante: number;
  fecha_evento: string;
  hora_evento: string;
  lugar: string;
  estado: string;
  equipo_local_nombre: string;
  equipo_local_colores: string;
  equipo_visitante_nombre: string;
  equipo_visitante_colores: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
    IonItem,
    IonIcon,
    IonButton,
    IonSelect,
    IonCard,
    IonSelectOption,
    IonCardHeader,
    IonCardContent,
    IonBadge,
    TitleCasePipe,
    UpperCasePipe,
    IonInput,
    IonCol,
    IonRow,
    NgxPaginationModule
  ],
})
export class FolderPage implements OnInit {
  public folder: string = 'Lista de eventos';
  private activatedRoute = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private fb = inject(FormBuilder);
  filterForm = this.fb.group({
    estado: ['todos'],
    fecha: [''],
  });

  eventos = signal<Evento[]>([]);
  filtros = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value,
  });
  page = 1;
  constructor() {
    addIcons({
      calendarOutline,
      calendarSharp,
      calendarClearOutline,
      closeCircleOutline,
      timeOutline,
      locationOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    this.getAllEvents();
  }
  eventosFiltrados = computed(() => {
    const currentEventos = this.eventos();
    const currentFiltros = this.filtros();

    return currentEventos.filter((evento) => {
      const coincideEstado =
        currentFiltros.estado === 'todos' ||
        evento.estado === currentFiltros.estado;

      const coincideFecha =
        !currentFiltros.fecha || evento.fecha_evento === currentFiltros.fecha;

      return coincideEstado && coincideFecha;
    });
  });
  getAllEvents() {
    this.eventService.getAll().subscribe((res: any) => {
      console.log(res);
      this.eventos.set(res.data);
    });
  }
  limpiarFecha() {
    this.filterForm.patchValue({ fecha: '' });
  }
  pagination(page: number) {
    this.page = page;
  }
}
