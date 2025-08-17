
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
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
      label: 'Our Services',
      subItems: [
        {
          label: 'SD Hospital',
          link: '/sd-hospital-news'
        },
        {
          label: 'Digital Diagnostic Center',
          link: '/digital-diagnostic-news'
        }
      ]
    },
    // {
    //   label: 'Pathology Report',
    //   link: '/report'
    // },
    {
      label: 'Portal',
      link: '/serial'
    },
    {
      label: 'Career',
      link: '/career'
    },
    {
      label: 'About',
      link: '/about'
    },
    {
      label: 'Contact',
      link: '/contact'
    },
  ];
  isOpen = signal(false);

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  closeMenu() {
    this.isOpen.set(!this.isOpen());
  }

}
