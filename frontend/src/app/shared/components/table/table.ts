import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportSection } from '../../../core/models/table/table.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.html',
})
export class Table {
  @Input() sections: ReportSection[] = [];
  @Input() quarters: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  @Input() accentClass = 'border-stone-400 bg-stone-50 text-stone-900';
  @Input() valuesByRow: Record<string, number[]> = {};
  @Input() editable = false;

  @Output() valuesByRowChange = new EventEmitter<Record<string, number[]>>();

  getValues(rowId: string): number[] {
    if (!this.valuesByRow[rowId]) this.valuesByRow[rowId] = [0, 0, 0, 0];
    return this.valuesByRow[rowId];
  }

  rowTotal(rowId: string): number {
    return this.getValues(rowId).reduce((a, b) => a + b, 0);
  }

  onCellChange() {
    this.valuesByRowChange.emit(this.valuesByRow);
  }
}