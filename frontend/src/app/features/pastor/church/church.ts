import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface ModalData {
  church: string;
  department: string;
  category: string;
  total: number;
}

@Component({
  selector: 'app-church',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './church.html',
  styleUrl: './church.css',
})
export class Church {
  modalOpen = signal(false);
  modalData = signal<ModalData>({ church: '', department: '', category: '', total: 0 });

  openModal(church: string, department: string, category: string, total: number) {
    this.modalData.set({ church, department, category, total });
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }
}