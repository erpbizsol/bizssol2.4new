import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import { INavData } from '@coreui/angular';
import { HeaderService } from '../services/Shared/header.service'; // Import HeaderService
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { DefaultHeaderComponent } from './default-header/default-header.component';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { MenuService } from '../services/Menu-Service/menu.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard', 
  templateUrl: './default-layout.component.html', 
  styleUrls: ['./default-layout.component.scss'],
  standalone: true, 
  imports: [
    HttpClientModule, 
    SidebarComponent, 
    SidebarHeaderComponent, 
    SidebarBrandComponent, 
    RouterLink, 
    IconDirective, 
    NgScrollbar,
    SidebarNavComponent, 
    SidebarFooterComponent, 
    SidebarToggleDirective, 
    SidebarTogglerDirective, 
    DefaultHeaderComponent, 
    ShadowOnScrollDirective, 
    ContainerComponent, 
    RouterOutlet, 
    DefaultFooterComponent, 
    CommonModule, 
  ],
  providers: [MenuService, HeaderService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DefaultLayoutComponent implements OnInit { 
  public navItems: INavData[] = []; 

  constructor(private menuService: MenuService, private headerService: HeaderService) {} // Inject HeaderService

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList() {
    this.menuService.getMenuItems().subscribe((data: any) => { 
      this.navItems = this.transformMenuData(data); 
      this.navItems.unshift({ 
        name: 'Home',
        url: '',
        iconComponent: { name: 'cil-home' },
      });
    });
  }

  transformMenuData(data: any): INavData[] { 
    const urlMapping: { [key: string]: string } = { 
      'Enquiry': '/leads/table',
      'Country Master': '/leads/country',
      'State Master': '/leads/state',
      'City Master': '/leads/city',
      'UOM Master': '/leads/uom',
      'Payment Terms Master': 'leads/PaymentTermsMaster',
      'Item Type Configuration': 'leads/Item-Type-Configurations',
      'Stock Location Master': 'leads/tank-daily-stock',
      'Enquiry DataSheet': '/leads/Route-Plan',
      'Quotation': '/leads/Verify-Route-Plan'
    };

    const menuMap: { [key: string]: INavData } = {}; 
    const parentItems: INavData[] = []; 

    data.forEach((item: any) => { 
      const menuItem: INavData = { 
        name: item.ModuleDesp,
        iconComponent: { name: 'cil-notes' },
        children: [],
        expanded: false,
        url: urlMapping[item.ModuleDesp], 
      };

      menuMap[item.Code] = menuItem; 
      if (item.MasterCode === '0') { 
        parentItems.push(menuItem); 
      } else { 
        const parent = menuMap[item.MasterCode];
        if (parent) { 
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(menuItem); 
          menuItem.expanded = parent.expanded || false; 
        }
      }
    });

    return parentItems.map(parent => { 
      if (parent.children!.length === 0) { 
        delete parent.children;
      }
      return parent; 
    });
  }

  toggleChildrenVisibility(item: INavData) { 
    if (!item.children || item.children.length === 0) { 
      return;
    }
    item.expanded = !item.expanded; 
    this.navItems.forEach(parent => { 
      if (parent !== item) {
        parent.expanded = false;
      }
    });
  }

  // Update selected item on click
  onNavItemClicked(item: INavData) {
    this.headerService.setSelectedItem(item.name);
  }
}
