/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateItemInput = {
  id?: string | null,
  name: string,
  sku: string,
  inventory: boolean,
  scannedFound: boolean,
  scannedMissing: boolean,
};

export type UpdateItemInput = {
  id: string,
  name?: string | null,
  sku?: string | null,
  inventory?: boolean | null,
  scannedFound?: boolean | null,
  scannedMissing?: boolean | null,
};

export type DeleteItemInput = {
  id?: string | null,
};

export type ModelItemFilterInput = {
  id?: ModelIDFilterInput | null,
  name?: ModelStringFilterInput | null,
  sku?: ModelStringFilterInput | null,
  inventory?: ModelBooleanFilterInput | null,
  scannedFound?: ModelBooleanFilterInput | null,
  scannedMissing?: ModelBooleanFilterInput | null,
  and?: Array< ModelItemFilterInput | null > | null,
  or?: Array< ModelItemFilterInput | null > | null,
  not?: ModelItemFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreateItemMutationVariables = {
  input: CreateItemInput,
};

export type CreateItemMutation = {
  createItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type UpdateItemMutationVariables = {
  input: UpdateItemInput,
};

export type UpdateItemMutation = {
  updateItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type DeleteItemMutationVariables = {
  input: DeleteItemInput,
};

export type DeleteItemMutation = {
  deleteItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type GetItemQueryVariables = {
  id: string,
};

export type GetItemQuery = {
  getItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type ListItemsQueryVariables = {
  filter?: ModelItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListItemsQuery = {
  listItems:  {
    __typename: "ModelItemConnection",
    items:  Array< {
      __typename: "Item",
      id: string,
      name: string,
      sku: string,
      inventory: boolean,
      scannedFound: boolean,
      scannedMissing: boolean,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateItemSubscription = {
  onCreateItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type OnUpdateItemSubscription = {
  onUpdateItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};

export type OnDeleteItemSubscription = {
  onDeleteItem:  {
    __typename: "Item",
    id: string,
    name: string,
    sku: string,
    inventory: boolean,
    scannedFound: boolean,
    scannedMissing: boolean,
  } | null,
};
