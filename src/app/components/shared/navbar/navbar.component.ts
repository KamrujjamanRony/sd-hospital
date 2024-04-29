import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuItems = [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Doctor',
      link: '/doctors'
    },
    {
      label: 'Gallery',
      subItems: [
        {
          label: 'Instrument Gallery',
          link: '/gallery/instrument'
        },
        {
          label: 'Hospital Gallery',
          link: '/gallery/hospital'
        }
      ]
    },
    {
      label: 'News',
      subItems: [
        {
          label: 'Latest News',
          link: '/hospital-news'
        },
        {
          label: 'Health Magazines',
          link: '/health-news'
        }
      ]
    },
    {
      label: 'About',
      link: '/about'
    },
    {
      label: 'Contact',
      link: '/contact'
    },
    {
      label: 'Portal',
      link: '/serial'
    },
  ];
  isOpen: boolean = false;

  toggleMenu(){
    this.isOpen = !this.isOpen;
  }

  closeMenu(){
    this.isOpen = !this.isOpen;
  }

}
