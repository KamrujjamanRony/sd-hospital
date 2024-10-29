import { Injectable } from '@angular/core';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.rootApi + '/Appointment/'
    // headers: {
    //   'Content-Type' : 'application/json',
    //   'Accept' : 'application/json'
    // }
  })

  constructor() { } 

  query = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.getAppointments(),
  }));

  getAppointment(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    return Appointments?.find((d) => d.id == id);
  }

  async getAppointments(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching Appointments:', error);
      throw error;
    }
  }

  async addAppointment(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/', model);
      return response.data;
    } catch (error) {
      console.error('Error fetching Appointments:', error);
      throw error;
    }
  }

  async updateAppointment(id: any, updateData: any): Promise<any>{
    try {
      const response = await this.apiClient.put(`/EditAppointment/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  };

  async deleteAppointment(id: any): Promise<any>{
    try {
      const response = await this.apiClient.delete(`/DeleteAppointment?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  getAppointmentById(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    const selected = Appointments?.find((d) => d.id == id);
    return selected.AppointmentName;
  }
}
