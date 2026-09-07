import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';


/* ============ TYPES ============ */
 
export type QuarterKey = 'q1' | 'q2' | 'q3' | 'q4';
export type SelectedView = 'annual' | QuarterKey;
 
export type RowType = 'sum' | 'latest' | 'computed' | 'subhead';
 
export type QuarterStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'reviewed'
  | 'returned'
  | 'approved'
  | 'not_started';
 
export interface RowConfig {
  id: string;
  label: string;
  type: RowType;
  indent?: boolean;
  tip?: string;
  /** Only used when type === 'computed': ids of rows this row sums. */
  deps?: string[];
}
 
export interface SectionConfig {
  id: string;
  title: string;
  rows: RowConfig[];
}
 
export interface QuarterData {
  status: QuarterStatus;
  values: Record<string, number | null>;
  /** Human-readable date this quarter's data was last touched, shown in the panel header. */
  lastUpdated?: string;
}
 
export interface OfficerComment {
  author: string;
  role: string;
  date: string;
  status: QuarterStatus;
  text: string;
}
 
export interface TimelineEntry {
  date: string;
  title: string;
  sub: string;
}
 
/* ============ REPORT CONFIG (from the paper monitoring device) ============ */
 
export const SECTIONS: SectionConfig[] = [
  {
    id: 'ss',
    title: 'Sabbath School',
    rows: [
      { id: 'no_ss', label: 'No. of Sabbath Schools', type: 'latest' },
      { id: '_sub1', label: 'Sabbath School Membership', type: 'subhead' },
      { id: 'cradle', label: 'Cradle Roll (0–4 yrs)', type: 'latest', indent: true },
      { id: 'kinder', label: 'Kindergarten (5–6)', type: 'latest', indent: true },
      { id: 'primary', label: 'Primary (7–9)', type: 'latest', indent: true },
      { id: 'junior', label: 'Junior (10–13)', type: 'latest', indent: true },
      { id: 'earliteens', label: 'Earliteens (13–15)', type: 'latest', indent: true },
      { id: 'youth', label: 'Youth (16–35)', type: 'latest', indent: true },
      { id: 'adult', label: 'Adult (35 & above)', type: 'latest', indent: true },
      {
        id: 'extension',
        label: 'Extension Division',
        type: 'latest',
        indent: true,
        tip: 'Members enrolled through home or extension Sabbath School units unable to attend in person.',
      },
      {
        id: 'total_ss',
        label: 'Total SS Membership',
        type: 'computed',
        deps: ['cradle', 'kinder', 'primary', 'junior', 'earliteens', 'youth', 'adult', 'extension'],
      },
      { id: 'vbs', label: 'Vacation Bible School Enrollment', type: 'sum' },
      {
        id: 'ss_teachers',
        label: 'Sabbath School Teachers — Certified',
        type: 'latest',
        tip: 'Teachers who have completed the official SS teacher certification training.',
      },
    ],
  },
  {
    id: 'pm',
    title: 'Personal Ministries',
    rows: [
      { id: 'trained', label: 'No. of Members Trained this Quarter', type: 'sum' },
      { id: 'involved', label: 'No. of Members Actively Involved in Evangelism', type: 'latest' },
      { id: 'churches', label: 'No. of Churches that Participated in Evangelism', type: 'latest' },
      { id: 'seminars', label: 'Lay Evangelism & Seminars Conducted', type: 'sum' },
      { id: 'bible_studies', label: 'Lay Bible Studies', type: 'sum' },
      {
        id: 'baptisms',
        label: "Baptisms Resulting from Laymen, Pastors, LE's",
        type: 'sum',
        tip: 'Includes baptisms credited to lay evangelists (LE), pastors, and lay members.',
      },
      { id: 'literature', label: 'Pieces of Literature Distributed', type: 'sum' },
      {
        id: 'community_service',
        label: 'Community Service Unit',
        type: 'latest',
        tip: 'Number of active community service units currently operating in the church.',
      },
      {
        id: 'asi_chapters',
        label: 'ASI Chapters',
        type: 'latest',
        tip: "Adventist-laymen's Services & Industries chapters affiliated with the church.",
      },
    ],
  },
];
 
export const QUARTER_LABELS: Record<QuarterKey, string> = {
  q1: '1st Quarter',
  q2: '2nd Quarter',
  q3: '3rd Quarter',
  q4: '4th Quarter',
};
 
export const QUARTER_SHORT: Record<QuarterKey, string> = {
  q1: 'Q1',
  q2: 'Q2',
  q3: 'Q3',
  q4: 'Q4',
};
 
export type StatusIcon = 'check' | 'warn' | 'edit' | 'clock' | 'dash';
 
export const STATUS_META: Record<QuarterStatus, { label: string; badge: string; icon: StatusIcon }> = {
  draft: { label: 'Draft', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', icon: 'edit' },
  submitted: { label: 'Submitted', badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', icon: 'clock' },
  under_review: { label: 'Under Review', badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', icon: 'clock' },
  reviewed: { label: 'Reviewed', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: 'check' },
  returned: { label: 'Returned for Revision', badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200', icon: 'warn' },
  approved: { label: 'Reviewed', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: 'check' },
  not_started: { label: 'Not Started', badge: 'bg-slate-100 text-slate-400 ring-1 ring-slate-200', icon: 'dash' },
};
 
/** Small solid-color dot used next to quarter labels in the tab selector. */
export const DOT_COLOR: Record<QuarterStatus, string> = {
  draft: 'bg-amber-500',
  submitted: 'bg-sky-500',
  under_review: 'bg-sky-500',
  reviewed: 'bg-emerald-500',
  approved: 'bg-emerald-500',
  returned: 'bg-rose-500',
  not_started: 'bg-slate-300',
};
 
export const EDITABLE_STATUSES: QuarterStatus[] = ['draft', 'returned', 'not_started'];
 
/* ============ SAMPLE DATA — 2026 ============ */
 
export function createSampleQuarters(): Record<QuarterKey, QuarterData> {
  return {
    q1: {
      status: 'approved',
      lastUpdated: 'April 5, 2026',
      values: {
        no_ss: 3, cradle: 12, kinder: 16, primary: 20, junior: 22, earliteens: 14, youth: 38, adult: 95,
        extension: 8, vbs: 0, ss_teachers: 18, trained: 12, involved: 45, churches: 1, seminars: 2,
        bible_studies: 34, baptisms: 3, literature: 500, community_service: 1, asi_chapters: 0,
      },
    },
    q2: {
      status: 'returned',
      lastUpdated: 'June 28, 2026',
      values: {
        no_ss: 3, cradle: 14, kinder: 17, primary: 20, junior: 23, earliteens: 15, youth: 40, adult: 97,
        extension: 9, vbs: 85, ss_teachers: 19, trained: 15, involved: 52, churches: 1, seminars: 3,
        bible_studies: 40, baptisms: 5, literature: 650, community_service: 1, asi_chapters: 0,
      },
    },
    q3: {
      status: 'draft',
      lastUpdated: 'Sept 3, 2026',
      values: {
        no_ss: 3, cradle: 15, kinder: 18, primary: 21, junior: 23, earliteens: 15, youth: 42, adult: 99,
        extension: 9, vbs: 0, ss_teachers: 19, trained: 10, involved: 48, churches: 1, seminars: null,
        bible_studies: 38, baptisms: 2, literature: 420, community_service: 1, asi_chapters: null,
      },
    },
    q4: { status: 'not_started', values: {} },
  };
}
 
export function createSampleComments(): Record<QuarterKey, OfficerComment[]> {
  return {
    q1: [
      {
        author: 'Pr. Ramon Alcantara',
        role: 'District Pastor',
        date: 'April 5, 2026',
        status: 'approved',
        text: 'Report reviewed and approved. Sabbath School attendance growth this quarter is well documented — good work.',
      },
    ],
    q2: [
      {
        author: 'Pr. Ramon Alcantara',
        role: 'District Pastor',
        date: 'June 28, 2026',
        status: 'returned',
        text: "Please verify the number of active members involved in evangelism. The submitted value appears inconsistent with the church's monthly evangelism report.",
      },
    ],
    q3: [],
    q4: [],
  };
}
 
export function createSampleTimeline(): TimelineEntry[] {
  return [
    { date: 'Sept 3, 2026', title: '3rd Quarter draft saved', sub: 'Saved by Juan Dela Cruz' },
    { date: 'June 28, 2026', title: '2nd Quarter returned for revision', sub: 'Comment added by Pr. Ramon Alcantara' },
    { date: 'June 25, 2026', title: '2nd Quarter report submitted', sub: 'Submitted by Juan Dela Cruz' },
    { date: 'June 20, 2026', title: '2nd Quarter draft saved', sub: 'Saved by Juan Dela Cruz' },
    { date: 'April 5, 2026', title: '1st Quarter report approved', sub: 'Reviewed by Pr. Ramon Alcantara' },
    { date: 'April 2, 2026', title: '1st Quarter report submitted', sub: 'Submitted by Juan Dela Cruz' },
  ];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public authService: AuthService) {}

 /* ---------- Static config, exposed to the template ---------- */
  readonly sections = SECTIONS;
  readonly quarterKeys: QuarterKey[] = ['q1', 'q2', 'q3', 'q4'];
  readonly quarterLabels = QUARTER_LABELS;
  readonly quarterShort = QUARTER_SHORT;
  readonly statusMeta = STATUS_META;
  readonly dotColor = DOT_COLOR;
 
  /* ---------- Church identity (banner + info card) ---------- */
  readonly churchName = 'Maribago Seventh-day Adventist Church';
  readonly district = 'Central District';
  readonly mission = 'Northeast Luzon Mission';
  readonly representative = 'Juan Dela Cruz';
  readonly year = 2026;
  readonly department = 'Sabbath School & Personal Ministries';
 
  /* ---------- Mutable state ---------- */
  selected: SelectedView = 'annual';
  lastUpdated = 'Sept 3, 2026';
  showOlderComments = false;
 
  submitModalOpen = false;
  modalBodyText = '';
  private pendingSubmitQuarter: QuarterKey | null = null;
 
  toastMessage = '';
  toastVisible = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
 
  quarters: Record<QuarterKey, QuarterData> = createSampleQuarters();
  comments: Record<QuarterKey, OfficerComment[]> = createSampleComments();
  timeline: TimelineEntry[] = createSampleTimeline();
 
  /* ---------- Selection helpers ---------- */
 
  get selectedQuarterKey(): QuarterKey | null {
    return this.selected === 'annual' ? null : this.selected;
  }
 
  get activeQuarter(): QuarterKey | null {
    return this.selectedQuarterKey;
  }
 
  get activeStatus(): QuarterStatus | null {
    const q = this.selectedQuarterKey;
    return q ? this.quarters[q].status : null;
  }
 
  get activeEditable(): boolean {
    const status = this.activeStatus;
    return status ? this.isEditableStatus(status) : false;
  }
 
  get overallHasReturned(): boolean {
    return this.quarterKeys.some((q) => this.quarters[q].status === 'returned');
  }
 
  /** All officer comments, most relevant quarter first, for the Annual Overview view. */
  get allComments(): Array<OfficerComment & { q: QuarterKey }> {
    const priorityOrder: QuarterKey[] = ['q2', 'q1', 'q3', 'q4'];
    const all: Array<OfficerComment & { q: QuarterKey }> = [];
    priorityOrder.forEach((q) => this.comments[q].forEach((c) => all.push({ ...c, q })));
    return all;
  }
 
  isEditableStatus(status: QuarterStatus): boolean {
    return EDITABLE_STATUSES.includes(status);
  }
 
  selectQuarter(q: SelectedView): void {
    this.selected = q;
    this.showOlderComments = false;
  }
 
  panelSubtitle(): string {
    if (this.selected === 'annual') {
      return 'All four quarters, consolidated';
    }
    const status = this.activeStatus!;
    if (this.activeEditable) {
      return status === 'returned'
        ? 'Returned for revision — you can edit and resubmit'
        : 'Editable draft — previous quarters shown for reference';
    }
    return 'Read-only — this quarter has been ' + this.statusMeta[status].label.toLowerCase();
  }
 
  /** "EDITABLE" / "READ-ONLY" tag shown next to the active quarter's status pill. */
  editableTag(): string {
    return this.activeEditable ? 'EDITABLE' : 'READ-ONLY';
  }

  statusLabel(status: QuarterStatus): string {
    return this.statusMeta[status].label;
  }

  get visibleQuarterKeys(): QuarterKey[] {
    return this.selected === 'annual' ? this.quarterKeys : [this.selected as QuarterKey];
  }
  /* ---------- Value calculations ---------- */
 
  getRawValue(rowId: string, q: QuarterKey): number | null {
    const v = this.quarters[q].values[rowId];
    return v === undefined || v === null ? null : Number(v);
  }
 
  getComputedValue(row: RowConfig, q: QuarterKey): number | null {
    let sum = 0;
    let any = false;
    (row.deps ?? []).forEach((depId) => {
      const v = this.getRawValue(depId, q);
      if (v !== null) {
        sum += v;
        any = true;
      }
    });
    return any ? sum : null;
  }
 
  getDisplayValue(row: RowConfig, q: QuarterKey): number | null {
    return row.type === 'computed' ? this.getComputedValue(row, q) : this.getRawValue(row.id, q);
  }
 
  /** Yearly total: summed for cumulative indicators, or the latest submitted value for snapshot indicators. */
  getTotal(row: RowConfig): { value: number | null; source: string | null } {
    const order: QuarterKey[] = ['q1', 'q2', 'q3', 'q4'];
 
    if (row.type === 'sum') {
      let sum = 0;
      let any = false;
      order.forEach((q) => {
        const v = this.getDisplayValue(row, q);
        if (v !== null) {
          sum += v;
          any = true;
        }
      });
      return any ? { value: sum, source: null } : { value: null, source: null };
    }
 
    for (let i = order.length - 1; i >= 0; i--) {
      const q = order[i];
      const v = this.getDisplayValue(row, q);
      if (v !== null) {
        return { value: v, source: this.quarterShort[q] };
      }
    }
    return { value: null, source: null };
  }
 
  isCellEditable(row: RowConfig, q: QuarterKey): boolean {
    return this.activeQuarter === q && this.activeEditable && row.type !== 'computed';
  }
 
  onInputChange(row: RowConfig, q: QuarterKey, event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value;
    if (raw !== '' && Number(raw) < 0) {
      raw = '0';
      input.value = '0';
    }
    this.quarters[q].values[row.id] = raw === '' ? null : Number(raw);
  }
 
  /* ---------- Actions ---------- */
 
  saveDraft(): void {
    const q = this.activeQuarter;
    if (!q) return;
    this.addTimelineEntry(`${this.quarterLabels[q]} draft saved`, 'Saved by Juan Dela Cruz');
    this.showToast('Draft saved');
  }
 
  openSubmitModal(): void {
    const q = this.activeQuarter;
    if (!q) return;
    this.pendingSubmitQuarter = q;
    this.modalBodyText = `Are you sure you want to submit the ${this.quarterLabels[q]} report? You will no longer be able to edit this quarter unless the report is returned for revision.`;
    this.submitModalOpen = true;
  }
 
  closeSubmitModal(): void {
    this.submitModalOpen = false;
    this.pendingSubmitQuarter = null;
  }
 
  confirmSubmit(): void {
    const q = this.pendingSubmitQuarter;
    if (!q) return;
    this.quarters[q].status = 'submitted';
    this.addTimelineEntry(`${this.quarterLabels[q]} report submitted`, 'Submitted by Juan Dela Cruz');
    this.showToast(`${this.quarterLabels[q]} report submitted`);
    this.closeSubmitModal();
  }
 
  private addTimelineEntry(title: string, sub: string): void {
    this.timeline.unshift({ date: 'Sept 6, 2026', title, sub });
    this.lastUpdated = 'Sept 6, 2026';
  }
 
  private showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 2600);
  }
}
