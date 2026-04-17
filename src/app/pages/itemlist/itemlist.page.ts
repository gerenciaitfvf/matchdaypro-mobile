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
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import {
  arrowUndo,
  checkmarkCircle,
  checkmarkDoneCircleOutline,
  ellipseOutline,
  timeOutline,
} from 'ionicons/icons';
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
  private authService = inject(AuthService);
  private router = inject(Router);
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
  user: any;
  constructor() {
    addIcons({
      checkmarkDoneCircleOutline,
      checkmarkCircle,
      arrowUndo,
      ellipseOutline,
      timeOutline,
    });
  }
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
    this.user = this.authService.tokenUser();
    if (!this.user) {
      this.authService.logout();
      this.router.navigate(['login']);
    }
  }
  getItemlist() {
    this.itemService.getAll(this.id).subscribe((res: any) => {
      this.items.set(res.data);
    });
  }
  toggleEstado(item: ItemEvento, slidingElement: any) {
    const nuevoEstado = item.completado === 0 ? 1 : 0;
    item.completado = nuevoEstado;
    let data = {
      idEvento: this.id,
      idItem: item.id_item,
      completado: nuevoEstado,
      notas: 'ola',
      completado_por: `${this.user?.userName} ${this.user?.userLastName}`,
    };
    this.itemService.updateStatus(data).subscribe((res: any) => {});

    this.items.update((itemsActuales) =>
      itemsActuales.map((i) =>
        i.id === item.id ? { ...i, completado: nuevoEstado } : i,
      ),
    );

    slidingElement.close();
  }
}
