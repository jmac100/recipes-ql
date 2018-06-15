import gql from 'graphql-tag';

const addRecipeMutation = gql`
  mutation addRecipe($name: String!, $description: String, $image: String, $url: String) {
    addRecipe(name: $name, description: $description, image: $image, url: $url) {
      id
      name
      description
      image
      url
    }
  }
`

const editRecipeMutation = gql`
  mutation editRecipe($id: ID!, $name: String!, $description: String, $image: String, $url: String) {
    editRecipe(id: $id, name: $name, description: $description, image: $image, url: $url) {
      id
      name
      description
      image
      url
    }
  }
`

const deleteRecipeMutation = gql`
  mutation deleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      id
      name
      description
      image
      url
    }
  }
`

const addIngredientMutation = gql`
  mutation addIngredient($description: String!, $recipeId: String!, $ordinal: Int!) {
    addIngredient(description: $description, recipeId: $recipeId, ordinal: $ordinal) {
      id
      description
      ordinal
    }
  }
`

const editIngredientMutation = gql`
  mutation editIngredient($id: String!, $description: String, $ordinal: Int) {
    editIngredient(id: $id, description: $description, ordinal: $ordinal) {
      id
      description
      ordinal
    }
  }
`

const deleteIngredientMutation = gql`
  mutation deleteIngredient($id: ID!) {
    deleteIngredient(id: $id) {
      id
      description
      ordinal
    }
  }
`

const deleteIngredientByRecipeMutation = gql`
  mutation deleteIngredientByRecipe($recipeId: String!) {
    deleteIngredientByRecipe(recipeId: $recipeId) {
      id
      description
    }
  }
`

const addInstructionMutation = gql`
  mutation addInstruction($description: String!, $recipeId: String!, $ordinal: Int!) {
    addInstruction(description: $description, recipeId: $recipeId, ordinal: $ordinal) {
      id
      description
      ordinal
    }
  }
`

const editInstructionMutation = gql`
  mutation editInstruction($id: String!, $description: String, $ordinal: Int) {
    editInstruction(id: $id, description: $description, ordinal: $ordinal) {
      id
      description
      ordinal
    }
  }
`

const deleteInstructionMutation = gql`
  mutation deleteInstruction($id: ID!) {
    deleteInstruction(id: $id) {
      id
      description
      ordinal
    }
  }
`

const deleteInstructionByRecipeMutation = gql`
  mutation deleteInstructionByRecipe($recipeId: String!) {
    deleteInstructionByRecipe(recipeId: $recipeId) {
      id
      description
    }
  }
`

export {
  addRecipeMutation,
  editRecipeMutation,
  deleteRecipeMutation,
  addIngredientMutation,
  editIngredientMutation,
  deleteIngredientMutation,
  deleteIngredientByRecipeMutation,
  addInstructionMutation,
  editInstructionMutation,
  deleteInstructionMutation,
  deleteInstructionByRecipeMutation
}