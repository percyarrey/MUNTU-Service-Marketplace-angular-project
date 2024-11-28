import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  Inject,
} from '@angular/core';

interface Category {
  name: string;
  description: string;
  image: string;
}
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

/* UTILS */
import { deleteCookie } from '../../utils/decodeCookie';

/* PRIMENG */
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SidebarModule } from 'primeng/sidebar';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClientService } from '../../../modules/client/services/client.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    TieredMenuModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  /* CHECK SCROLL */
  Scrolled: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private router: Router,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {
    if (isPlatformBrowser(this.platformID)) {
      this.Scrolled = window.scrollY !== 0;
      window.addEventListener('scroll', () => {
        this.Scrolled = window.scrollY !== 0;
      });
    }
  }

  /* MENU */
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.services = this.clientService.getSuggestions('service');
    this.country = this.clientService.getSuggestions('country');
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            items: [
              {
                label: 'Document',
                icon: 'pi pi-file',
              },
              {
                label: 'Image',
                icon: 'pi pi-image',
              },
              {
                label: 'Video',
                icon: 'pi pi-video',
              },
            ],
          },
          {
            label: 'Open',
            icon: 'pi pi-folder-open',
          },
          {
            label: 'Print',
            icon: 'pi pi-print',
          },
        ],
      },
      {
        label: 'Edit',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'Copy',
            icon: 'pi pi-copy',
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
          },
        ],
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: (event) => {
          this.logout();
        },
      },
    ];
  }

  isRoute(route: string | string[]): boolean {
    const routes = Array.isArray(route) ? route : [route];

    return routes.some((el) => {
      if (el === '') {
        return this.router.url.valueOf() === '/';
      } else {
        return this.router.url.startsWith('/' + el);
      }
    });
  }

  logout(): void {
    deleteCookie('token');
    this.router.navigate(['/']);
  }

  /*  SIDEBAR */
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;
  sidebarCategoryExpand: boolean = false;

  /* CATEGORY */
  categories: Category[] = [
    {
      name: 'Electrician',
      description:
        'Offers electrical installation, maintenance, and repair services.',
      image: 'assets/images/client/home/electrician.png',
    },
    {
      name: 'Electronic',
      description: 'Provides electronic services for residential.',
      image: 'assets/images/client/home/electronic.png',
    },

    {
      name: 'Mechanic',
      description: 'Specializes in automotive repairs and maintenance.',
      image: 'assets/images/client/home/mechanic.png',
    },
    {
      name: 'Glazier',
      description:
        'Installs and repairs glass in windows, doors, and other structures.',
      image: 'assets/images/client/home/glazier.png',
    },
  ];
  selectedCategory: Category = {
    name: '',
    description: '',
    image: '',
  };

  onSelectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  /* CHANGE LANGUAGE */
  changeLang(): void {}

  /* AUTO COMPLETE SERVICES*/
  services: any[] | undefined;
  serviceSuggestions: any[] = [];

  selectedService: any;

  searchServices(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.services as any[]).length; i++) {
      let service = (this.services as any[])[i];
      if (service.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(service);
      }
    }

    this.serviceSuggestions = filtered;
  }

  /* AUTO COMPLETE COUNTRY*/
  country: any[] | undefined;
  countrySuggestions: any[] = [];

  selectedCountry: any;

  searchCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.country as any[]).length; i++) {
      let country = (this.country as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.countrySuggestions = filtered;
  }

  /* SEARCH DROPDOWN */
  searchVisible: boolean = false;

  searchClient() {
    this.searchVisible = false;
    const queryParams = { ...this.route.snapshot.queryParams }; // Get the existing query parameters
    (queryParams['s'] = this.selectedService?.name
      ? this.selectedService.name
      : this.selectedService),
      (queryParams['location'] = this.selectedCountry?.name
        ? this.selectedCountry.name
        : this.selectedCountry);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }
}
