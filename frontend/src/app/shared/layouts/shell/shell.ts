import { Component, inject } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/nav-service';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  nav = inject(NavigationService);
}
