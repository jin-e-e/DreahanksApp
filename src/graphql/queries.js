/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHolidayInfo = /* GraphQL */ `
  query GetHolidayInfo($id: ID!) {
    getHolidayInfo(id: $id) {
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
export const listHolidayInfos = /* GraphQL */ `
  query ListHolidayInfos(
    $filter: ModelHolidayInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHolidayInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        date
        dateTo
        contents
        confirmFlg
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWorkInfo = /* GraphQL */ `
  query GetWorkInfo($id: ID!) {
    getWorkInfo(id: $id) {
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
export const listWorkInfos = /* GraphQL */ `
  query ListWorkInfos(
    $filter: ModelWorkInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWorkInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
