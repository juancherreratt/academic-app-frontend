import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // private isOpen = new BehaviorSubject<boolean>(false);
  private modalsState: { [key: string]: BehaviorSubject<boolean> } = {};
  // isOpen$ = this.isOpen.asObservable();

  getModalState(modalId: string) {
    if (!this.modalsState[modalId]) {
      this.modalsState[modalId] = new BehaviorSubject<boolean>(false);
    }
    return this.modalsState[modalId].asObservable();
  }

  open(modalId: string) {
    if (!this.modalsState[modalId]) {
      this.modalsState[modalId] = new BehaviorSubject<boolean>(true);
    } else {
      this.modalsState[modalId].next(true);
    }
  }

  close(modalId: string) {
    if (this.modalsState[modalId]) {
      this.modalsState[modalId].next(false);
    }
  }

  // open() {
  //   this.isOpen.next(true);
  // }

  // close() {
  //   this.isOpen.next(false);
  // }
}
