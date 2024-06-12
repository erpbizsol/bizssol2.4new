import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../assets/icons/icon-subset';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/Auth-Service/auth.service';
// import { AuthService } from './services/Auth-Service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title = 'ERP 2.4';
  userData:any
  userid: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.userid = params.get('Auth-Key');
      if (this.userid) {
        this.authService.setAuthKey(this.userid);
      } else {
        console.error('Auth-Key not found in URL');
      }
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      // Additional logic if needed when navigation ends
    });
  }


}
