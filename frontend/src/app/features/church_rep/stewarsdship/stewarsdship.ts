import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-stewarsdship',
  imports: [],
  templateUrl: './stewarsdship.html',
  styleUrl: './stewarsdship.css',
})
export class Stewarsdship implements OnInit{

  constructor(
    public authService: AuthService
  ){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
