import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ================= TYPES ================= */
export type Scope = 'mission' | 'district' | 'church';
export type ViewName = 'list' | 'detail';

export interface Church {
  id: string;
  name: string;
  districtId: string;
}

export interface District {
  id: string;
  name: string;
  churches: Church[];
}

export interface AnnouncementItem {
  id: string;
  scope: Scope;
  title: string;
  body: string;
  districtId: string | null;
  churchId: string | null;
  source: string;
  by: string;
  days: number;
  unread: boolean;
}

export interface Route {
  view: ViewName;
  id?: string;
}

export interface Filter {
  districtId: string | null;
  churchId: string | null;
  scope: Scope | 'all';
  q: string;
}

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, FormsModule],
  templateUrl: './announcement.html',
})
export class Announcement implements OnInit {

  /* ---- static roster ---- */
  private readonly DISTRICT_ROSTER: [string, string[]][] = [
    ['Batanes', ['Pasuc']],
    ['Northwestern Cagayan (NWC)', ['Calayan', 'San Antonio', 'Claveria Centro', 'Namuac', 'Sanchez Mira', 'Buguey', 'San Julian', 'Guzman Company']],
    ['North Central Cagayan (NCG)', ['Cabaruan', 'Centro Ballesteros', 'Payagan', 'Annafunan', 'Linao', 'Navagan', 'Sta. Cruz', 'Mabutag', 'San Agustin']],
    ['West Central Cagayan', ['Pugod', 'Carbonan', 'Bangag', 'Caunayan', 'Matucay', 'Cabarauan']],
    ['Eastern Cagayan', ['San Vicente', 'Aparri', 'Caroan', 'Paytao', 'Lafu', 'Minanga Company']],
    ['East Central Cagayan', ['Logac', 'Cabanaban', 'Lasam', 'Ufan', 'Tagao']],
    ['Northeastern Cagayan 1', ['Dummun', 'Ogging', 'Ganzano', 'Calamagui', 'Matalao Company']],
    ['Northeastern Cagayan 2', ['Capirayan', 'T. Putagan', 'Tagumay Company', 'Bunnayan', 'Agaman Company']],
    ['Southern Cagayan', ['Anuling Church', 'Caguiwan Church', 'Calantan', 'Nanungaran Church', 'Sampaguita Church', 'Catabagan Company', 'Sto. Niño Nueve Company']],
    ['Metro Tuguegarao', ['Tuguegarao Central', 'Libag Company', 'Cabbo Company', 'Namnama']],
    ['Mallig', ['Quiling', 'Rizal', 'Cullalabo', 'Mabini', 'Furao', 'Daug', 'Aurora']],
    ['Metro Ilagan', ['Sipay', 'Malalam', 'Rang-ayan', 'Bliss', 'Cabisera 14 Cataguan', 'Namnama', 'Cabisera 9/11', 'Cabisera 7', 'Palucpuc']],
    ['Northwestern Isabela', ['Guzon', 'Bimoton', 'Villa Corazon', 'Carmencita', 'Villa Ganzo', 'Sta. Catalina', 'Santiago', 'San Ramon Company']],
    ['Northern Isabela 1', ['Balembong', 'Cauayan', 'Antatan', 'San Juan', 'Baybay', 'Aneg', 'San Antonio', 'Rasan Almacen']],
    ['Northern Isabela 2', ['Minano', 'Lanna', 'San Mateo Tumauini', 'Antagan', 'Cumabao', 'Lapogan']],
    ['Northeastern Isabela', ['Maguilan', 'Reina Mercedes', 'Sta. Cruz', 'Placer', 'Disulap', 'Dingasnan', 'Turod']],
    ['West Central Isabela', ['Laing', 'Dadap', 'Marana', 'Cauayan Center', 'Villa Luna', 'Villa Concepcion', 'Minante', 'Naganacan', 'Naguilian', 'San Isidro']],
    ['Western Isabela', ['Namnama', 'Recarona', 'Malasin', 'Salinungan', 'Villa Cruz', 'Nagsabaran', 'Sinamar', 'Aguinaldo Company']],
    ['North Central Isabela', ['Dr. Pilar', 'Burgos', 'Mabini', 'Villa Domingo', 'Vega', 'Dipalua', 'San Ambrocio']],
    ['South Central Isabela', ['Alicia', 'Villa Flor', 'Naguilian', 'Gomez', 'Angoleon', 'Doña Faustina', 'Castillo Company', 'Loida', 'Reserva Company', 'San Guillermo']],
    ['Southeastern Isabela', ['San Manuel', 'Sta. Maria', 'Villa Marina', 'San Isidro', 'San Antonio', 'Sto. Niño', 'Mapalad Company', 'Sta. Ana']],
    ['Southern Isabela', ['Divisoria', 'Ahso', 'Santiago', 'Cordon', 'Sta. Rosa Company']],
    ['Quirino West', ['Salvacion', 'Saguday', 'Bangar', 'Sta. An', 'Cabbaga', 'Diffun', 'La Paz Company']],
    ['Quirino East', ['Diobol Company', 'Dumbo Company', 'Diguyon', 'Diffun Company', 'Puagbo']],
    ['Northern Nueva Vizcaya', ['Namanparan', 'Sinuhan Company', 'Sta. Cruz', 'Bagabag', 'Solano', 'Aggub', 'Communal']],
    ['Southwestern Nueva Vizcaya', ['Kirapa Company', 'Indiana', 'Alimaguio', 'Tucanon', 'Alibao', 'Bone', 'Ilaan Company', 'Comon']],
    ['Southeastern Nueva Vizcaya', ['Ramang', 'Paungan', 'Abinganan', 'Malasin', 'Belance', 'Manakka']],
    ['Eastern Nueva Vizcaya', ['Kinogkiran Company', 'Canamasi Company', 'Cordon', 'Macalong', 'Kongkong Company', 'Paqui', 'Moya Company', 'Maglan', 'Palia', 'Poblacion']],
    ['Central Nueva Vizcaya', ['La Torre', 'Masoc', 'Pinket Company', 'Ramabong', 'Busilac', 'Paitan', 'Sto. Domingo', 'Palaran Company']],
  ];

  private readonly pastors = ['Ptr. R. Domingo', 'Ptr. C. Bayani', 'Ptr. E. Suarez', 'Ptr. D. Wangdali', 'Ptr. J. Ramil', 'Ptr. A. Castillejos', 'Ptr. M. Tolentino', 'Ptr. L. Ordoñez'];
  private readonly clerks = ['G. Ferrer', 'P. Cauilan', 'L. Mendiola', 'R. Villamor', 'N. Bacani', 'T. Ancheta', 'S. Dela Cruz', 'F. Baluyot'];

  private readonly D_TEMPLATES: [string, string][] = [
    ["District workers' meeting moved to the first Sunday", "All church clerks are advised that the district workers' meeting has been moved to the first Sunday of next month. Venue remains the district center church. Please bring your quarterly attendance logbook."],
    ['Reminder: quarterly report deadline', 'This is a reminder to all churches under this district to finalize and submit their departmental quarterly reports on or before the 20th. Late submissions will not be included in the district consolidation.'],
    ['District-wide prayer week schedule released', 'The schedule for the district-wide week of prayer has been finalized. Each church is assigned one evening. Coordinators will receive the speaker assignments separately.'],
    ['Call for youth camp delegates', 'Each church is requested to send at least four delegates to the district youth camp. Names and contact numbers should be forwarded to the district youth director.'],
    ['Tithe remittance reminder', 'All church treasurers are reminded to remit collections to the district treasurer on or before the last Sabbath of the month, together with the signed remittance slip.'],
  ];

  private readonly C_TEMPLATES: [string, string][] = [
    ['Church board meeting this Sunday', 'The church board will convene this Sunday after the divine service. Department heads are requested to prepare a short verbal update on their programs.'],
    ['Volunteers needed for community outreach', 'We are looking for volunteers to assist in the upcoming community health outreach. Kindly sign up with the personal ministries secretary after the service.'],
    ['Baptismal class schedule', 'Baptismal classes will begin this coming Sabbath afternoon at the fellowship hall. Candidates and their sponsors are encouraged to attend all sessions.'],
    ['Church anniversary program', 'Our church anniversary celebration will be held this month. A planning committee has been formed and will post the full program shortly.'],
    ["Sabbath School teachers' training", "A short refresher training for all Sabbath School teachers and cradle roll helpers will be conducted before the quarter ends."],
  ];

  private readonly M_TEMPLATES: [string, string][] = [
    ['Mission-wide Youth Congress registration is open', 'Registration for the mission-wide Youth Congress is now open to all districts. Slots are limited and will be allocated per district quota.'],
    ['Updated remittance procedure effective this quarter', 'The mission treasury has released an updated remittance procedure. District treasurers should review the circular before processing the next batch.'],
    ['Mission office holiday schedule', 'Please be advised of the adjusted mission office hours for the coming holiday period. Urgent concerns may be coursed through the administrative assistant.'],
  ];

  /* ---- generated data ---- */
  districts: District[] = [];
  announcements: AnnouncementItem[] = [];

  /* ---- state ---- */
  route: Route = { view: 'list' };
  filter: Filter = { districtId: null, churchId: null, scope: 'all', q: '' };
  openDistricts: { [id: string]: boolean } = {};

  ngOnInit(): void {
    this.districts = this.buildDistricts();
    this.announcements = this.buildAnnouncements(this.districts);
  }

  /* ================= DATA BUILDING ================= */
  private buildDistricts(): District[] {
    return this.DISTRICT_ROSTER.map(([name, churchNames], i) => {
      const id = 'dist' + i;
      const churches: Church[] = churchNames.map((c, j) => ({
        id: `dist${i}-ch${j}`,
        name: c,
        districtId: id,
      }));
      return { id, name, churches };
    });
  }

  private seeded(n: number): number {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  }

  private buildAnnouncements(districts: District[]): AnnouncementItem[] {
    let idc = 0;
    const list: AnnouncementItem[] = [];

    this.M_TEMPLATES.forEach((t, i) => {
      list.push({
        id: 'a' + idc++,
        scope: 'mission',
        title: t[0],
        body: t[1],
        districtId: null,
        churchId: null,
        source: 'Mission Office',
        by: 'Mercy Aquino · Administrative Assistant',
        days: 2 + i * 4,
        unread: i === 0,
      });
    });

    districts.forEach((d, di) => {
      const nD = 1 + Math.floor(this.seeded(di + 1.7) * 2); // 1–2 district announcements
      for (let k = 0; k < nD; k++) {
        const t = this.D_TEMPLATES[Math.floor(this.seeded(di * 3 + k + 2.1) * this.D_TEMPLATES.length)];
        list.push({
          id: 'a' + idc++,
          scope: 'district',
          title: t[0],
          body: t[1],
          districtId: d.id,
          churchId: null,
          source: d.name,
          by: this.pastors[(di + k) % this.pastors.length] + ' · District Pastor',
          days: 1 + Math.floor(this.seeded(di * 5 + k + 3.3) * 40),
          unread: this.seeded(di * 7 + k) > 0.72,
        });
      }
      d.churches.forEach((c, ci) => {
        if (this.seeded(di * 11 + ci + 4.5) > 0.55) {
          const t = this.C_TEMPLATES[Math.floor(this.seeded(di * 13 + ci + 5.9) * this.C_TEMPLATES.length)];
          list.push({
            id: 'a' + idc++,
            scope: 'church',
            title: t[0],
            body: t[1],
            districtId: d.id,
            churchId: c.id,
            source: c.name + ' Church',
            by: this.clerks[(di + ci) % this.clerks.length] + ' · Church Clerk',
            days: 1 + Math.floor(this.seeded(di * 17 + ci + 6.4) * 45),
            unread: this.seeded(di * 19 + ci) > 0.8,
          });
        }
      });
    });

    list.sort((a, b) => a.days - b.days);
    return list;
  }

  /* ================= DATE FORMAT ================= */
  dateStr(daysAgo: number): string {
    const d = new Date(2026, 8, 15);
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ================= ROUTING ================= */
  go(r: Route): void {
    this.route = r;
    window.scrollTo(0, 0);
  }

  openDetail(id: string): void {
    const a = this.announcements.find(x => x.id === id);
    if (a) a.unread = false;
    this.go({ view: 'detail', id });
  }

  get currentAnnouncement(): AnnouncementItem | undefined {
    return this.announcements.find(x => x.id === this.route.id);
  }

  /* ================= FILTERING ================= */
  countFor(districtId: string | null, churchId: string | null): number {
    return this.announcements.filter(a => {
      if (churchId) return a.churchId === churchId;
      if (districtId) return a.districtId === districtId;
      return true;
    }).length;
  }

  get filtered(): AnnouncementItem[] {
    return this.announcements.filter(a => {
      if (this.filter.churchId && a.churchId !== this.filter.churchId) return false;
      if (!this.filter.churchId && this.filter.districtId && a.districtId !== this.filter.districtId) return false;
      if (this.filter.scope !== 'all' && a.scope !== this.filter.scope) return false;
      if (this.filter.q) {
        const q = this.filter.q.toLowerCase();
        if (!(a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q) || a.source.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }

  get scopeLabel(): string | null {
    if (this.filter.churchId) {
      const d = this.districts.find(x => x.id === this.filter.districtId);
      const c = d && d.churches.find(x => x.id === this.filter.churchId);
      return c ? `${d!.name} › ${c.name}` : 'All';
    }
    if (this.filter.districtId) {
      const d = this.districts.find(x => x.id === this.filter.districtId);
      return d ? d.name : 'All';
    }
    return null;
  }

  get unreadCount(): number {
    return this.filtered.filter(a => a.unread).length;
  }

  get districtCount(): number {
    return this.filtered.filter(a => a.scope === 'district').length;
  }

  truncate(body: string, max = 150): string {
    return body.length > max ? body.slice(0, max) + '…' : body;
  }

  /* ---- filter rail interactions ---- */
  toggleDistrict(did: string): void {
    if (this.openDistricts[did] && this.filter.districtId === did && !this.filter.churchId) {
      this.openDistricts[did] = false;
      this.filter.districtId = null;
    } else {
      this.openDistricts[did] = true;
      this.filter.districtId = did;
    }
    this.filter.churchId = null;
  }

  selectChurch(districtId: string, churchId: string): void {
    this.filter.churchId = this.filter.churchId === churchId ? null : churchId;
    this.filter.districtId = districtId;
    this.openDistricts[districtId] = true;
  }

  setScopeTab(scope: Scope | 'all'): void {
    this.filter.scope = scope;
  }

  clearFilter(): void {
    this.filter = { districtId: null, churchId: null, scope: 'all', q: '' };
    this.openDistricts = {};
  }

  matchesSearch(d: District): boolean {
    const q = this.filter.q.toLowerCase();
    if (!q) return true;
    return d.name.toLowerCase().includes(q) || d.churches.some(c => c.name.toLowerCase().includes(q));
  }

}