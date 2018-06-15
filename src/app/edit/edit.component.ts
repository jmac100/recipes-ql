import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";

import { Recipe, Query, Mutation, Ingredient, Instruction } from '../type';
import { recipeQuery, recipesQuery } from "../queries";
import {
  addIngredientMutation,
  addRecipeMutation,
  addInstructionMutation,
  editIngredientMutation,
  editInstructionMutation,
  editRecipeMutation,
  deleteIngredientMutation,
  deleteInstructionMutation,
  deleteIngredientByRecipeMutation,
  deleteInstructionByRecipeMutation,
  deleteRecipeMutation
} from '../mutations';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: string
  recipe: Recipe
  ingredient: string
  instruction: string

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')

    this.apollo.watchQuery<Query>({
      query: recipeQuery,
      variables: {
        id: this.id
      }
    })
      .valueChanges
      .pipe(
        map(res => res.data.recipe)
      )
      .subscribe(r => this.recipe = r)
  }

  addIngredient() {
    this.apollo.mutate<Mutation>({
      mutation: addIngredientMutation,
      variables: {
        description: this.ingredient,
        recipeId: this.recipe.id,
        ordinal: this.recipe.Ingredients.length + 1
      },
      refetchQueries: [{
        query: recipeQuery,
        variables: {
          id: this.recipe.id
        }
      }]
    }).subscribe(() => this.ingredient = '')
  }

  editIngredient(id, ingredient) {
    if (!ingredient) return;

    this.apollo.mutate<Mutation>({
      mutation: editIngredientMutation,
      variables: {
        id,
        description: ingredient
      },
      refetchQueries: [{
        query: recipeQuery,
        variables: {
          id: this.recipe.id
        }
      }]
    }).subscribe()
  }

  addInstruction() {
    this.apollo.mutate<Mutation>({
      mutation: addInstructionMutation,
      variables: {
        description: this.instruction,
        recipeId: this.recipe.id,
        ordinal: this.recipe.Instructions.length + 1
      },
      refetchQueries: [{
        query: recipeQuery,
        variables: {
          id: this.recipe.id
        }
      }]
    }).subscribe(() => this.instruction = '')
  }

  editInstruction(id, instruction) {
    this.apollo.mutate<Mutation>({
      mutation: editInstructionMutation,
      variables: {
        id,
        description: instruction
      },
      refetchQueries: [{
        query: recipeQuery,
        variables: {
          id: this.recipe.id
        }
      }]
    }).subscribe()
  }

  save(name, description, image, url) {
    this.apollo.mutate<Mutation>({
      mutation: editRecipeMutation,
      variables: {
        id: this.recipe.id,
        name,
        description,
        image,
        url
      },
      refetchQueries: [{
        query: recipesQuery
      }]
    }).subscribe(() => this.router.navigate(['/recipes', this.recipe.id]))
  }

  deleteIngredient(ingredient) {
    let ordinal = ingredient.ordinal
    this.recipe.Ingredients.forEach(i => {
      this.apollo.mutate<Mutation>({
        mutation: editIngredientMutation,
        variables: {
          id: i.id,
          ordinal: i.ordinal > ordinal ? i.ordinal - 1 : i.ordinal
        }
      }).subscribe(() => {
        this.apollo.mutate<Mutation>({
          mutation: deleteIngredientMutation,
          variables: {
            id: ingredient.id
          },
          refetchQueries: [{
            query: recipeQuery,
            variables: {
              id: this.recipe.id
            }
          }]
        }).subscribe()
      })
    })
  }

  deleteInstruction(instruction) {
    let ordinal = instruction.ordinal
    this.recipe.Instructions.forEach(i => {
      this.apollo.mutate<Mutation>({
        mutation: editInstructionMutation,
        variables: {
          id: i.id,
          ordinal: i.ordinal > ordinal ? i.ordinal - 1 : i.ordinal
        }
      }).subscribe(() => {
        this.apollo.mutate<Mutation>({
          mutation: deleteInstructionMutation,
          variables: {
            id: instruction.id
          },
          refetchQueries: [{
            query: recipeQuery,
            variables: {
              id: this.recipe.id
            }
          }]
        }).subscribe()
      })
    })
  }

  delete() {
    if (!confirm(`This will permanently remove "${this.recipe.name}". Continue?`)) return

    this.apollo.mutate<Mutation>({
      mutation: deleteIngredientByRecipeMutation,
      variables: {
        recipeId: this.id
      }
    }).subscribe()

    this.apollo.mutate<Mutation>({
      mutation: deleteInstructionByRecipeMutation,
      variables: {
        recipeId: this.id
      }
    }).subscribe()

    this.apollo.mutate<Mutation>({
      mutation: deleteRecipeMutation,
      variables: {
        id: this.id
      },
      refetchQueries: [{
        query: recipesQuery
      }]
    }).subscribe(() => this.router.navigate(['/']))
  }
}