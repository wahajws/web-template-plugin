import { httpService } from './http';
import { iBaseServiceGeneric}  from '../../models/common';

export class BaseService {

  readonly  httpUrl: iBaseServiceGeneric;  
  constructor(request: iBaseServiceGeneric) {
    this.httpUrl = {
      getAllUrl: request.getAllUrl,
      getByIdUrl: request.getByIdUrl,
      createUrl: request.createUrl,
      updateUrl: request.updateUrl,
      deleteUrl: request.deleteUrl,
    };
  }
  
  async get(url: string, body?:any): Promise<any> {
    try {
      console.log("baseService calling: ", url);
      const response = await httpService.get<any>(url, { params: body });

      // Extract data from the response object
      const data = response?.data || response || [];
      const result = Array.isArray(data) ? data : [];
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getAll(): Promise<any> {
    return this.get(this.httpUrl.getAllUrl);
  }

  async getById(id: number): Promise<any> {
    try {
      console.log("baseService calling: ", this.httpUrl.getByIdUrl+`/${id}`);
      const response = await httpService.get<any>(this.httpUrl.getByIdUrl+`/${id}`);

      // Extract data from the response object
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  }

  async create(createData: any): Promise<any> {
    try {
      createData = await this.getCreateStamp(createData);
      console.log("baseService calling: ", this.httpUrl.createUrl, createData);
      const response = await httpService.post<any>(this.httpUrl.createUrl, createData);

      // Extract user from the response object
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any> {
    try {
      data = await this.getUpdateStamp(data);
      console.log("baseService calling: ", this.httpUrl.updateUrl+`/${id}`, data);
      const response = await httpService.put<any>(this.httpUrl.updateUrl+`/${id}`, data);      

      // Extract data from the response object
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log("baseService calling: ", this.httpUrl.deleteUrl + `/${id}`);
      await httpService.delete(this.httpUrl.deleteUrl + `/${id}`);

    } catch (error) {
      throw error;
    }
  }

  async getUpdateStamp(data: any){
      const dataStamp= await this.getLocalStorage(); 
      data.updatedById = dataStamp.id;
      data.updatedDate = new Date();

      return data;
  }
  
  async getCreateStamp(data: any){
      const dataStamp= await this.getLocalStorage(); 
      data.createdById = dataStamp.id;
      // data.createdDate = new Date();     // Create date is auto set by the server

      return data;
  }

  async getLocalStorage(){
    const user_data: any = localStorage.getItem("user_data");
    const dataStamp= JSON.parse(user_data); 
    return dataStamp
  }
}
