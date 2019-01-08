import * as React from "react";
import { Formik } from "formik";
import { Form, Input, Label, Button } from "reactstrap";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { produce } from "immer";
import ReactTable from "react-table";
import "react-table/react-table.css";

import { createItem } from "./graphql/mutations";
import {
  CreateItemMutation,
  CreateItemMutationVariables,
  ListItemsQuery,
  ListItemsQueryVariables
} from "./API";
import { listItems } from "./graphql/queries";

interface FormValues {
  name: string;
  sku: string;
  inventory: boolean;
  scannedFound: boolean;
  scannedMissing: boolean;
}

let columns = [{
  Header: 'Name',
  accessor: 'name' // String-based value accessors!
}, {
  Header: 'Sku',
  accessor: 'sku',
}, {
  Header: 'ID',
  accessor: 'id',
}, {
  id: 'inventory',
  Header: 'Inventory',
  accessor: (data: any) => data.inventory.toString(),
}, {
  id: 'scannedMissing',
  Header: 'Scanned Missing',
  accessor: (data: any) => data.scannedMissing.toString(),
}, {
  id: 'scannedFound',
  Header: 'Scanned Found',
  accessor: (data: any) => data.scannedFound.toString(),
}

];

export const CheckSkuForm = () => {
  return (

    <Query<ListItemsQuery, ListItemsQueryVariables>
      query={gql(listItems)}
      variables={{
        filter: {
          sku: {
            eq: "testttt"
          },
          inventory: {
            eq: true
          },
          scannedMissing: {
            eq: false
          },
          scannedFound: {
            eq: false
          }

        }
      }}
    >
      {({ data, loading, subscribeToMore }) => {
        if (
          loading ||
          !data ||
          !data.listItems ||
          !data.listItems.items
        ) {
          return null;
        }

        return (
          <div>
            <Mutation<CreateItemMutation, CreateItemMutationVariables>
              mutation={gql(createItem)}
            >
              {createItem => (
                <Formik<FormValues>
                  initialValues={{
                    name: "",
                    sku: "",
                    inventory: true,
                    scannedFound: false,
                    scannedMissing: false,
                  }}
                  onSubmit={async ({ name, sku, inventory, scannedFound, scannedMissing }, { resetForm }) => {
                    // call mutation
                    const response = await createItem({
                      variables: {
                        input: {
                          name,
                          sku,
                          inventory,
                          scannedFound,
                          scannedMissing,
                        }
                      },
                      optimisticResponse: {
                        createItem: {
                          __typename: "Item",
                          id: "-1",
                          name,
                          sku,
                          inventory: true,
                          scannedFound: false,
                          scannedMissing: false,
                        }
                      },
                      update: (store, { data }) => {
                        if (!data || !data.createItem) {
                          return;
                        }

                        const items = store.readQuery<ListItemsQuery>({
                          query: gql(listItems),
                          variables: { limit: 1000 }
                        });

                        store.writeQuery({
                          query: gql(listItems),
                          variables: { limit: 1000 },
                          data: produce(items, ds => {
                            ds!.listItems!.items!.unshift(data.createItem);
                          })
                        });
                      }
                    });
                    console.log(response);
                    resetForm();
                  }}
                >
                  {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <Label>name</Label>
                      <Input
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        margin="normal"
                      />
                      <br />
                      <Label>sku</Label>
                      <Input
                        name="sku"
                        value={values.sku}
                        onChange={handleChange}
                        margin="normal"
                      />
                      <br />
                      <Button type="submit">
                        Submit
                  </Button>
                    </Form>
                  )}
                </Formik>
              )}
            </Mutation>
            <ReactTable data={data.listItems.items} columns={columns} defaultPageSize={5} />
          </div>
        );
      }
      }
    </Query>
  );
};
