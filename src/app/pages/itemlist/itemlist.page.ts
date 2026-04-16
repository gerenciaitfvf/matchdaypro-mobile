import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/angular/standalone';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
export interface ItemEvento {
  id: number;
  id_item: number;
  completado: number; // 0 o 1
  completado_por: string | null;
  completado_at: string | null;
  nombre: string;
  descripcion: string;
  tiempo_antes: number;
  tipo: string;
  orden: number;
}
@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.page.html',
  styleUrls: ['./itemlist.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    ReactiveFormsModule,
    IonItem,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
  ],
})
export class ItemlistPage implements OnInit {
  private itemService = inject(ItemService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  id: number = 0;
  filterForm = this.fb.group({
    estado: ['1'],
  });
  items = signal<ItemEvento[]>([]);
  filtros = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value,
  });
  itemsFiltrados = computed(() => {
    const currentItems = this.items();
    const filtro = this.filtros()?.estado;

    const estadoBuscado = Number(filtro);
    return currentItems.filter((item) => item.completado === estadoBuscado);
  });

  ngOnInit() {
    this.init();
  }
  init() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) {
        return;
      } else {
        this.id = +idParam;
        this.getItemlist();
      }
    });
  }
  ionViewWillEnter() {
    this.init();
  }
  getItemlist() {
    this.itemService.getAll(this.id).subscribe((res: any) => {
      this.items.set(res.data);
    });
  }
  toggleEstado(item: ItemEvento, slidingElement: any) {
    // Cambiamos el estado localmente (si es 0 pasa a 1, si es 1 pasa a 0)
    const nuevoEstado = item.completado === 0 ? 1 : 0;
    item.completado = nuevoEstado;
    let data = { id: item.id, completado: nuevoEstado };
    this.itemService.updateStatus(item).subscribe((res: any) => {});

    // Actualizamos el Signal para que la vista reaccione
    this.items.update((itemsActuales) =>
      itemsActuales.map((i) =>
        i.id === item.id ? { ...i, completado: nuevoEstado } : i,
      ),
    );

    // Cerramos el efecto de deslizamiento para que regrese a la normalidad
    slidingElement.close();
  }
}
