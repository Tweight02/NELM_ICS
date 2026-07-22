import { Component, input, ChangeDetectionStrategy, output} from '@angular/core';
import { NavItem } from '../../../core/models/navigation/nav-item.model';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class Navbar {
  items = input.required<NavItem[]>();
  portalLabel = input<string>('');
  open = input<boolean>(false);
  linkClicked = output<void>();
}
