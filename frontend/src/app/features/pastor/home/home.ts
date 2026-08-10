import { Component, OnInit } from '@angular/core';
import { PastorService } from '../../../core/services/pastor/pastor-service';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home{
  constructor(public authService: AuthService) {}
}
