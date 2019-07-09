import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { AuthService } from "../auth.service";

import { Recipe, Query } from '../type';
import { recipeQuery } from "../queries";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  id: string
  recipe: Recipe

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')

    this.apollo.query<Query>({
      query: recipeQuery,
      variables: {
        id: this.id
      }
    }).subscribe(res => this.recipe = res.data.recipe)
  }
}
