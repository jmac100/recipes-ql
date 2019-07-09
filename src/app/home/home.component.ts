import { Component, OnInit } from '@angular/core'
import { Apollo } from 'apollo-angular'
import { map } from 'rxjs/operators'
import { AuthService } from '../auth.service'

import { Recipe, Query } from '../type'
import { recipesQuery } from '../queries'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = []
  filtered: Recipe[] = []
  loading: boolean = true
  filter: string = localStorage['recipe_filter'] || ''

  constructor(private apollo: Apollo, public auth: AuthService) {}

  ngOnInit() {
    this.apollo
      .watchQuery<Query>({
        query: recipesQuery
      })
      .valueChanges.pipe(map(res => res.data.recipes))
      .subscribe(r => {
        this.recipes = r
        this.filterList()
        this.loading = false
      })
  }

  filterList() {
    this.filtered = this.filter.length
      ? this.recipes.filter(
          r =>
            r.name.toLowerCase().indexOf(this.filter) > -1 ||
            r.description.indexOf(this.filter) > -1
        )
      : this.recipes
    localStorage.setItem('recipe_filter', this.filter)
  }
}
