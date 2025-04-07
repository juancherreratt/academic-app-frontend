import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isModalOpen : boolean | null = false;
  @Input() title = '';
  @Input() modalId: string = '';
  @Input() modalWidth: string = 'max-w-md';
  @Output() closing = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Suscribirse al estado del modal usando el modalId
    this.modalService.getModalState(this.modalId).subscribe((isOpen) => {
      this.isModalOpen = isOpen;
    });
  }

  closeModal() {
    this.closing.emit();
    this.modalService.close(this.modalId);
  }

  openModal() {
    this.modalService.open(this.modalId);
  }

}
