import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AnnouncementService,
  Announcement as AnnouncementData
} from '../../../core/services/announcement/announcement';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement.html',
})
export class Announcement implements OnInit {

  announcements: AnnouncementData[] = [];

  announcementsLoading = true;
  announcementsError = '';

  constructor(
    private announcementService: AnnouncementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementsLoading = true;
    this.announcementsError = '';

    this.announcementService.getAnnouncements().subscribe({
      next: (response) => {
        this.announcements = response.data;
        this.announcementsLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load announcements:', error);

        this.announcementsError = 'Unable to load announcements.';
        this.announcementsLoading = false;

        this.cdr.detectChanges();
      }
    });
  }
}