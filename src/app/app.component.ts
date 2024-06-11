import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../assets/icons/icon-subset';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/Auth-Service/auth.service';

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
    debugger
    // this.userid = this.route.snapshot.queryParamMap.get('UserMaster_Code')
    this.userData = sessionStorage.getItem('Auth-Key')
    const externalAuthKey = '{"ERPDBConStr":"Data Source=122.186.154.46,14332;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDBINFRAMAT;User ID=sa;pwd=biz1981;Packet Size=32000","ERPMainDBConStr":"data source = 122.186.154.46,14332; initial catalog = BizSolERPMainDB_INFRAMAT; uid = sa; PWD = biz1981; Max Pool Size = 5000","ERPDMSDBConStr":"DATA SOURCE = 122.186.154.46,14332; INITIAL CATALOG = BIZSOLERPMSDB_INFRAMAT; UID = SA; PWD = BIZ1981; MAX POOL SIZE = 5000","ERPDB_Name":"BizSolERPDBINFRAMAT","ERPMainDB_Name":"BizSolERPMainDB_INFRAMAT","ERPDMSDB_Name":"BIZSOLERPMSDB_INFRAMAT","AuthToken":"xyz", "UserMaster_Code":"13"}';
    // const externalAuthKey = this.userData;
    this.authService.setAuthKey(externalAuthKey);
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }


}
