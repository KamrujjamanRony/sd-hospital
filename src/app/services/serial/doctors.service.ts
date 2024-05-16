import { Injectable, inject } from '@angular/core';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  authService = inject(AuthService);
  user = this.authService.getUser();

  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.DoctorApi,
    // headers: {
    //   'Content-Type' : 'application/json',
    //   'Accept' : 'application/json',
    //   "Authorization" : 'Bearer ' + this.user.token
    // }
  });

  doctorsQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.getDoctors(),
  }));

  constructor() { } 

  async getDoctors(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/');
      const filteredDoctors = response.data.filter(data => data.companyID == environment.hospitalCode);
      return filteredDoctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async addDoctor(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/', model);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async updateDoctor(id: any, updateData: any): Promise<any>{
    try {
      const response = await this.apiClient.put(`/EditDoctor/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  };

  async deleteDoctor(id: any): Promise<any>{
    try {
      const response = await this.apiClient.delete(`/DeleteDoctor?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  getDoctor(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    return doctors?.find((d) => d.id == id);
  }

  getDoctorById(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    const selected = doctors?.find((d) => d.id == id);
    return selected;
  }

  async filterDoctorsByDepartment(departmentId: any): Promise<any[]> {
    try {
      // Wait for the query to finish and get the data
      await this.doctorsQuery.refetch();
      // Access the data
      const doctors = this.queryClient.getQueryData(['doctors']) as any[];
      // Filter the doctors based on departmentId
      return doctors?.filter((d) => d.departmentId == departmentId) || [];
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      return []; // Return an empty array in case of an error
    }
  }
  
}
