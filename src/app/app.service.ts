import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http'
import { environment } from "../environments/environment";

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  search(description: string, ingredients: string[], page: number) {
    let ingredientList;
    if (ingredients && ingredients.length) {
      ingredientList = ingredients.join(',')
    }
    let url: any = `${environment.cors_proxy}${environment.search_api_url}?q=${description}&i=${ingredientList}&p=${page}`
    return this.http.get(url)
  }

}
