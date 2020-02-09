import { Component, OnInit, Inject } from '@angular/core'
import { DOCUMENT } from "@angular/platform-browser";
import { Apollo } from 'apollo-angular'
import { map } from 'rxjs/operators'
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll'
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

  constructor(
    private apollo: Apollo,
    public auth: AuthService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any
  ) {}

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

    setTimeout(() => {
      if (localStorage.getItem('recipe-bookmark')) {
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#' + localStorage.getItem('recipe-bookmark'));
        this.pageScrollService.start(pageScrollInstance);
        localStorage.removeItem('recipe-bookmark')
      }
    }, 500);
  }

  filterList() {
    this.filtered = this.filter.length
      ? this.recipes.filter(
          r =>
            r.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 ||
            r.description.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 ||
            r.Ingredients.find(i => i.description.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
        )
      : this.recipes
    localStorage.setItem('recipe_filter', this.filter)
  }

  setBookmark(id) {
    localStorage.setItem('recipe-bookmark', id)
  }
}
