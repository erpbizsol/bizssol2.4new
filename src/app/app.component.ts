import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../assets/icons/icon-subset';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/Auth-Service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailsService } from './services/user-details/user-details.service';
import { ToasterService } from './services/toaster-message/toaster.service';
import { UserService } from './services/Shared/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  providers: [UserDetailsService, ToasterService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title = 'ERP 2.4';
  authKey: any;
  userDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService,
    private userDetailsService: UserDetailsService,
    private userService: UserService,
    private toasterService: ToasterService
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.authToken();
    this.getUserDetails();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  authToken() {
    this.route.queryParamMap.subscribe(params => {
      this.authKey = params.get('Auth-Key');
      if (this.authKey) {
        this.authService.setAuthKey(this.authKey);
      } 
    });
  }

  getUserDetails() {
    debugger
    this.userDetailsService.getUserDetails().subscribe({
      next: (data) => {
        this.userService.setUserDetails(data); 
        this.toasterService.showSuccess('userDetails get successfully')
      },
      error: (error) => {
        console.error('Error fetching user details', error);
      }
    });
  }
}
