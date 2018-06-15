import gql from 'graphql-tag';

const recipesQuery = gql`
  query recipes {
    recipes {
      id
      name
      description
      image
      url
      Ingredients {
        id
        description
        ordinal
      }
      Instructions {
        id
        description
        ordinal
      }
    }
  }
`

const recipeQuery = gql`
  query recipe($id: ID!) {
    recipe(id: $id) {
      id
      name
      description
      image
      url
      Ingredients {
        id
        description
        ordinal
      }
      Instructions {
        id
        description
        ordinal
      }
    }
  }
`

const recipeByName = gql`
  query recipeByName($name: String!) {
    recipeByName(name: $name) {
      id
      name
      description
      image
      url
    }
  }
`

export {
  recipesQuery,
  recipeQuery,
  recipeByName
}