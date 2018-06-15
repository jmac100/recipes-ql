import { Component, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AuthService } from "../auth.service";

import { Recipe, Query } from "../type";
import { recipesQuery } from "../queries";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  recipes: Recipe[] = []
  loading: boolean = true

  constructor(
    private apollo: Apollo,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.apollo.watchQuery<Query>({
      query: recipesQuery
    })
    .valueChanges
    .pipe(
      map(res => res.data.recipes)
    )
    .subscribe(r => {
      this.recipes = r
      this.loading = false
    })
  }
}
