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
    // this.userid='{"ERPDBConStr": "Data Source=220.158.165.98,65446;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDBBizTest;User ID=sa;pwd=biz1981;Packet Size=32000","ERPMainDBConStr": "Data Source=192.168.1.10;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPMainDB_GLENG;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDMSDBConStr": "Data Source=192.168.1.10;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDMSDB_GLENG;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDB_Name":"BizSolERPDBGLENG_Temp","ERPMainDB_Name":"BizSolERPMainDB_GLENG","ERPDMSDB_Name":"BizSolERPDMSDB_GLENG","AuthToken": "xyz","UserMaster_Code":"13"}';
    // this.authService.setAuthKey(this.userid);
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
