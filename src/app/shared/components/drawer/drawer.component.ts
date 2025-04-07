import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerService } from '../../services/drawer/drawer.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {
  @Input() isDrawerOpen : boolean | null = false;
  @Input() title: string = 'Drawer';
  @Input() drawerWidth: string = 'w-80';
  // @Output() closeDrawerEvent = new EventEmitter<void>();

  constructor(private drawerService: DrawerService) {}

  // Método para cerrar el drawer y emitir el evento
  // closeDrawer() {
  //   this.isDrawerOpen = false;
  //   this.closeDrawerEvent.emit();
  // }
  closeDrawer() {
    this.drawerService.close();
  }

  openDrawer() {
    this.drawerService.open();
  }
}
