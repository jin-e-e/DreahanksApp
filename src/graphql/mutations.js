/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createHolidayInfo = /* GraphQL */ `
  mutation CreateHolidayInfo(
    $input: CreateHolidayInfoInput!
    $condition: ModelHolidayInfoConditionInput
  ) {
    createHolidayInfo(input: $input, condition: $condition) {
      id
      userName
      date
      dateTo
      contents
      confirmFlg
      createdAt
      updatedAt
    }
  }
`;
export const updateHolidayInfo = /* GraphQL */ `
  mutation UpdateHolidayInfo(
    $input: UpdateHolidayInfoInput!
    $condition: ModelHolidayInfoConditionInput
  ) {
    updateHolidayInfo(input: $input, condition: $condition) {
      id
      userName
      date
      dateTo
      contents
      confirmFlg
      createdAt
      updatedAt
    }
  }
`;
export const deleteHolidayInfo = /* GraphQL */ `
  mutation DeleteHolidayInfo(
    $input: DeleteHolidayInfoInput!
    $condition: ModelHolidayInfoConditionInput
  ) {
    deleteHolidayInfo(input: $input, condition: $condition) {
      id
      userName
      date
      dateTo
      contents
      confirmFlg
      createdAt
      updatedAt
    }
  }
`;
export const createWorkInfo = /* GraphQL */ `
  mutation CreateWorkInfo(
    $input: CreateWorkInfoInput!
    $condition: ModelWorkInfoConditionInput
  ) {
    createWorkInfo(input: $input, condition: $condition) {
      id
      userName
      year
      month
      date
      day
      workStartTime
      workEndTime
      workRestTime
      contents
      createdAt
      updatedAt
    }
  }
`;
export const updateWorkInfo = /* GraphQL */ `
  mutation UpdateWorkInfo(
    $input: UpdateWorkInfoInput!
    $condition: ModelWorkInfoConditionInput
  ) {
    updateWorkInfo(input: $input, condition: $condition) {
      id
      userName
      year
      month
      date
      day
      workStartTime
      workEndTime
      workRestTime
      contents
      createdAt
      updatedAt
    }
  }
`;
export const deleteWorkInfo = /* GraphQL */ `
  mutation DeleteWorkInfo(
    $input: DeleteWorkInfoInput!
    $condition: ModelWorkInfoConditionInput
  ) {
    deleteWorkInfo(input: $input, condition: $condition) {
      id
      userName
      year
      month
      date
      day
      workStartTime
      workEndTime
      workRestTime
      contents
      createdAt
      updatedAt
    }
  }
`;
