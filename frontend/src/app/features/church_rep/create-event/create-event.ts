import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReportService } from '../../../core/services/reports/report-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventChurch, EventService } from '../../../core/services/event/event';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-event',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent implements OnInit{

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor (
    private report: EventService, 
    private router: Router
  ){
  }

  eventForm = new FormGroup({
    title: new FormControl('', Validators.required), 
    date_start: new FormControl(null, Validators.required),
    date_end: new FormControl(null, Validators.required),
    time: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  })

  saveEvent(){
    const raw = this.eventForm.getRawValue();
    const event: EventChurch = {
      title: raw.title!,
      date_start: raw.date_start!,
      date_end: raw.date_end!,
      description: raw.description!,
      time: raw.time!,
      address: raw.address!
    }

    console.log(event)

    this.report.createEvent(event).subscribe((res: any) => {
      console.log(res)
      Swal.fire({
        title: "Event created!",
        icon: "success"
      });
      setTimeout(() => {
        this.router.navigate(['/church_rep/event'], res.message)
      }, 1000);
    })
  }
}
