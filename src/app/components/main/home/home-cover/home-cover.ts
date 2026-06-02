import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-cover',
  imports: [],
  templateUrl: './home-cover.html',
  styleUrl: './home-cover.css'
})
export class HomeCover {
  @Input() title: string = "";
  @Input() path: string = "";

}
