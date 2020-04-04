import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { AppService } from "../app.service";
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { Apollo } from "apollo-angular";
import { AuthService } from "../auth.service";
import { toast } from "../../mat";

import { Mutation, Query } from "../type";
import { addRecipeMutation, addIngredientMutation, addInstructionMutation } from '../mutations';
import { recipesQuery, recipeByName } from '../queries';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searching: boolean = false
  description: string = ''
  ingredients: string = ''
  results: any
  nextPage: any
  page: number = 1
  cachedResults: string[] = []
  cachedSearhTerm: string
  noResultsFound: boolean = false

  constructor(
    private apollo: Apollo,
    private service: AppService,
    public auth: AuthService,
    private pageScrollService: PageScrollService, 
    @Inject(DOCUMENT) private document: any
  ) { 
    PageScrollConfig.defaultDuration = 500
  }

  ngOnInit() {
  }

  search() {
    if (!this.description && !this.ingredients) return

    this.searching = true
    this.noResultsFound = false
    const searchTerm = `${this.description}${this.ingredients}`
    const cacheIndex = `${searchTerm}${this.page}`

    if (searchTerm !== this.cachedSearhTerm) {
      this.cachedSearhTerm = searchTerm
      this.page = 1
    }

    if (this.cachedResults[cacheIndex]) {
      this.results = this.cachedResults[cacheIndex]
      this.searching = false
    } else {
    this.service.search(this.description, this.ingredients.split(','), this.page)
      .subscribe(data => {
        this.scrollToTop()
        this.results = this.cachedResults[cacheIndex] = data
        this.searching = false
        this.noResultsFound = !this.results.results.length
        this.prefetchNextResults()
      })
    }
  }

  prefetchNextResults() {
    this.nextPage = null
    const cacheIndex = `${this.cachedSearhTerm}${this.page + 1}`
    if (this.cachedResults[cacheIndex]) {
      this.nextPage = this.cachedResults[cacheIndex]
    } else {
      this.service.search(this.description, this.ingredients.split(','), this.page + 1)
      .subscribe(data => {
        this.nextPage = data
      })
    }
  }

  previous() {
    this.page = this.page - 1
    this.scrollToTop()
    this.search()
  }

  next() {
    this.page = this.page + 1
    this.scrollToTop()
    const cacheIndex = `${this.cachedSearhTerm}${this.page}`
    if (this.cachedResults[cacheIndex]) {
      this.results = this.cachedResults[cacheIndex]
      this.prefetchNextResults()
    } else {
      this.cachedResults[cacheIndex] = this.nextPage
      this.search()
      this.prefetchNextResults()
    }
  }

  scrollToTop() {
    setTimeout(() => {
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#scrollTarget');
      this.pageScrollService.start(pageScrollInstance);
    }, 500);
  }

  addRecipe(recipe) {
    this.apollo.mutate<Mutation>({
      mutation: addRecipeMutation,
      variables: {
        name: recipe.title,
        description: '',
        image: recipe.thumbnail,
        url: recipe.href
      },
      refetchQueries: [{
        query: recipesQuery
      }]
    }).subscribe(() => {
      this.apollo.query<Query>({
        query: recipeByName,
        variables: {
          name: recipe.title
        }
      }).subscribe(r => {
        if (recipe.ingredients) {
          recipe.ingredients.split(',').forEach((ingr, index) => {
            this.apollo.mutate<Mutation>({
              mutation: addIngredientMutation,
              variables: {
                description: ingr,
                recipeId: r.data.recipeByName.id,
                ordinal: index
              }
            }).subscribe()
          })
        }
        toast('Recipe saved...')
      })
    })
  }
}
