import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";

import { Query, Mutation } from "../type";
import { addRecipeMutation, addIngredientMutation, addInstructionMutation } from '../mutations';
import { recipesQuery, recipeByName } from '../queries';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  name: string = ""
  description: string = ""
  image: string = ""
  url: string = ""
  ingredients: any[] = []
  ingredient: string
  instructions: any[] = []
  instruction: string
  newId: string

  constructor
    (
    private apollo: Apollo,
    private router: Router
    ) { }

  ngOnInit() {
  }

  addIngredient() {
    if (!this.ingredient) return
    let newIngredient = {
      description: this.ingredient,
      ordinal: this.ingredients.length + 1,
      editMode: false
    }
    this.ingredients.push(newIngredient)
    this.ingredient = ''
  }

  deleteIngredient(ingredient) {
    this.ingredients = this.ingredients.filter(i => i.description !== ingredient.description)
    this.ingredients.map(i => i.ordinal = i.ordinal > ingredient.ordinal ? i.ordinal - 1 : i.ordinal)
  }

  deleteInstruction(instruction) {
    this.instructions = this.instructions.filter(i => i.description !== instruction.description)
    this.instructions.map(i => i.ordinal = i.ordinal > instruction.ordinal ? i.ordinal - 1 : i.ordinal)
  }

  addInstruction() {
    if (!this.instruction) return
    let newInstruction = {
      description: this.instruction,
      id: "0",
      ordinal: this.instructions.length + 1,
      editMode: false
    }
    this.instructions.push(newInstruction)
    this.instruction = ''
  }

  save() {
    this.apollo.mutate<Mutation>({
      mutation: addRecipeMutation,
      variables: {
        name: this.name,
        description: this.description,
        image: this.image,
        url: this.url
      },
      refetchQueries: [{
        query: recipesQuery
      }]
    }).subscribe(() => {
      this.redirect('recipe')
      this.apollo.query<Query>({
        query: recipeByName,
        variables: {
          name: this.name
        }
      }).subscribe(r => {
        this.newId = r.data.recipeByName.id

        if (this.ingredients.length === 0) this.redirect('ingredient')
        this.ingredients.forEach((ingr, index) => {
          this.apollo.mutate<Mutation>({
            mutation: addIngredientMutation,
            variables: {
              description: ingr.description,
              recipeId: this.newId,
              ordinal: ingr.ordinal
            }
          }).subscribe(() => {
            if (index == this.ingredients.length - 1) this.redirect('ingredient')
          })
        })

        if (this.instructions.length === 0) this.redirect('instruction')
        this.instructions.forEach((instr, index) => {
          this.apollo.mutate<Mutation>({
            mutation: addInstructionMutation,
            variables: {
              description: instr.description,
              recipeId: this.newId,
              ordinal: instr.ordinal
            }
          }).subscribe(() => {
            if (index == this.instructions.length - 1) this.redirect('instruction')
          })
        })
      })
    })
  }

  redirect(src: string) {
    switch (src) {
      case 'recipe': {
        if (this.ingredients.length === 0 && this.instructions.length === 0) {
          this.router.navigate(['/'])
        }
        break
      }
      case 'ingredient': {
        if (this.instructions.length === 0) {
          this.router.navigate(['/'])
        }
        break
      }
      case 'instruction': {
        this.router.navigate(['/'])
        break
      }
    }
  }
}