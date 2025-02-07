import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  template: `
  <div class="flex flex-col justify-center items-center py-8">
    <h1 class="lg:text-5xl text-2xl font-bold uppercase text-secondary">
      {{ title() }}
    </h1>
    <div class="flex justify-center items-center gap-3 text-gray-900 lg:text-3xl text-2xl my-2">
      <div class="lg:w-60 w-32 border border-gray-400"></div>
      <svg fill="#023ef2" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.10 490.10" xml:space="preserve" stroke="#023ef2" stroke-width="40.6783"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="66.65360000000001"> <g> <g> <path d="M469.2,0.55H20.8C9.3,0.55,0,9.95,0,21.35v447.4c0,11.4,9.3,20.8,20.8,20.8h448.5c11.4,0,19.7-8.3,20.8-19.7V21.35 C490,9.95,480.7,0.55,469.2,0.55z M448.5,449.05h-407v-407h406.9v407H448.5z"></path> <path d="M135,266.35h89.3v89.3c0,11.4,9.3,20.8,20.8,20.8s20.8-9.3,20.8-19.7v-90.3H355c11.4,0,20.8-9.3,21.8-20.8 c0-11.4-9.3-20.8-20.8-20.8h-90.3v-89.3c0-11.4-9.3-20.8-20.8-20.8s-20.8,9.3-20.8,20.8v89.3H135c-11.4,0-20.8,9.3-20.8,20.8 C114.2,257.15,123.5,266.35,135,266.35z"></path> </g> </g> </g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M469.2,0.55H20.8C9.3,0.55,0,9.95,0,21.35v447.4c0,11.4,9.3,20.8,20.8,20.8h448.5c11.4,0,19.7-8.3,20.8-19.7V21.35 C490,9.95,480.7,0.55,469.2,0.55z M448.5,449.05h-407v-407h406.9v407H448.5z"></path> <path d="M135,266.35h89.3v89.3c0,11.4,9.3,20.8,20.8,20.8s20.8-9.3,20.8-19.7v-90.3H355c11.4,0,20.8-9.3,21.8-20.8 c0-11.4-9.3-20.8-20.8-20.8h-90.3v-89.3c0-11.4-9.3-20.8-20.8-20.8s-20.8,9.3-20.8,20.8v89.3H135c-11.4,0-20.8,9.3-20.8,20.8 C114.2,257.15,123.5,266.35,135,266.35z"></path> </g> </g> </g></svg>
      <div class="lg:w-60 w-32 border border-gray-400"></div>
    </div>
  </div>
`
})
export class PageHeaderComponent {
  readonly title = input.required<string>();

}
