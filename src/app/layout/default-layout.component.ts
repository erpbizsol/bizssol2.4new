import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import { INavData } from '@coreui/angular';
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
  // SidebarNavDropdownComponent,
  // SidebarNavItemComponent
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
  providers: [MenuService], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DefaultLayoutComponent implements OnInit { 
  // Array to hold navigation items
  public navItems: INavData[] = []; 

  constructor(private menuService: MenuService) {} 

  ngOnInit(): void {
     // Call getMenuList on component initialization
    this.getMenuList();
  }

  getMenuList() {
    this.menuService.getMenuItems().subscribe((data: any) => { 
      // Transform the data and assign to navItems
      this.navItems = this.transformMenuData(data); 
// Add a "Home" item at the beginning of the navItems array
      this.navItems.unshift({ 
        name: 'Home',
        url: '',
        iconComponent: { name: 'cil-home' },
      });
    });
  }

  transformMenuData(data: any): INavData[] { 
    // Transform the raw menu data to INavData format
    const urlMapping: { [key: string]: string } = { 
      // Mapping of module descriptions to URLs
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
    // Map to hold menu items by their code
    // Array to hold parent menu items
    const parentItems: INavData[] = []; 

    data.forEach((item: any) => { 
      // Iterate over each item in the data
      const menuItem: INavData = { 
         // Set the name from the module description
        name: item.ModuleDesp,
        iconComponent: { name: 'cil-notes' },
        children: [], // Initialize an empty array for children
        expanded: false, // Initially set expanded to false
        url: urlMapping[item.ModuleDesp], // Set the URL based on the mapping
      };

      menuMap[item.Code] = menuItem; // Add the menu item to the map
       // Check if the item is a parent item
      if (item.MasterCode === '0') { 
        // Add to parent items array
        parentItems.push(menuItem); 
      } else { // If the item is a child item
         // Find the parent item
        const parent = menuMap[item.MasterCode];
        // If parent exists
        if (parent) { 
           // Ensure parent has a children array
          if (!parent.children) {
            parent.children = [];
          }
          // Add the item to parent's children
          parent.children.push(menuItem); 
          // Set expanded state based on parent
          menuItem.expanded = parent.expanded || false; 
        }
      }
    });
// Iterate over parent items
    return parentItems.map(parent => { 
      // Remove empty children arrays
      if (parent.children!.length === 0) { 
        delete parent.children;
      }
      // Return the modified parent item
      return parent; 
    });
  }
// Toggle the visibility of children menu items
  toggleChildrenVisibility(item: INavData) { 
    // If no children, do nothing
    if (!item.children || item.children.length === 0) { 
      return;
    }
    // Toggle the expanded state
    item.expanded = !item.expanded; 
    // Collapse all other items except the clicked one
    this.navItems.forEach(parent => { 
      if (parent !== item) {
        parent.expanded = false;
      }
    });
  }
}
