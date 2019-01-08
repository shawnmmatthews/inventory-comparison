import React, { useState } from 'react';
import { Formik } from "formik";
import wait from 'waait';
import { Alert, Form, Input, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from "graphql-tag";
import { produce } from "immer";
import { listItems } from "./graphql/queries";
import { updateItem } from "./graphql/mutations";
import {
  UpdateItemMutation,
  UpdateItemMutationVariables,
  ListItemsQuery
} from "./API";

interface FormValues {
  sku: string;
}

export const CheckSkuForm = () => {
  const [modal, setModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');

  const toggleModal = () => {
    setModal(!modal);
  }
  const toggleAlert = async () => {
    if (showAlert) {
      setShowAlert(false);
    }
    else {
      setShowAlert(true);
      await wait(5000);
      setShowAlert(false);
    }
  }

  return (
    <>
      <Alert color={alertColor} isOpen={showAlert} toggle={toggleAlert}>{alertMessage}</Alert>
      <Mutation<UpdateItemMutation, UpdateItemMutationVariables>
        mutation={gql(updateItem)}
      >
        {updateItem => (
          <ApolloConsumer>
            {client => (
              <Formik<FormValues>
                initialValues={{
                  sku: "",
                }}
                onSubmit={async ({ sku }, { resetForm }) => {
                  const { data }: any = await client.query({
                    query: gql(listItems),
                    variables: { filter: { sku: { eq: sku }, inventory: { eq: true } } },
                    fetchPolicy: 'network-only'
                  });
                  if (data.listItems.items[0]) {
                    console.log(data.listItems.items[0]);
                    console.log(data.listItems.items);
                    setAlertColor("success");
                    setAlertMessage("Scanned Item Found");
                    toggleAlert();
                    resetForm();
                    const response = await updateItem({
                      variables: {
                        input: {
                          id: data.listItems.items[0].id,
                          name: data.listItems.items[0].name,
                          sku: data.listItems.items[0].sku,
                          inventory: false,
                          scannedFound: true,
                          scannedMissing: false,
                        }
                      },
                      optimisticResponse: {
                        updateItem: {
                          __typename: "Item",
                          id: data.listItems.items[0].id,
                          name: data.listItems.items[0].name,
                          sku: data.listItems.items[0].sku,
                          inventory: false,
                          scannedFound: true,
                          scannedMissing: false,
                        }
                      },
                      update: (store, { data }) => {
                        if (!data || !data.updateItem) {
                          return;
                        }

                        const items = store.readQuery<ListItemsQuery>({
                          query: gql(listItems),
                          variables: { filter: { sku: { eq: sku }, inventory: { eq: true } } }
                        });

                        store.writeQuery({
                          query: gql(listItems),
                          variables: { filter: { sku: { eq: sku }, inventory: { eq: true } } },
                          data: produce(items, ds => {
                            ds!.listItems!.items!.unshift(data.updateItem);
                          })
                        });
                      }
                    });
                    console.log(response);
                  } else {
                    setAlertColor("danger");
                    setAlertMessage("Scanned Item Not Found");
                    toggleAlert();
                    toggleModal();
                    resetForm();
                  }

                }}
              >
                {({ values, handleChange, handleSubmit }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
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
                  )
                }}
              </Formik>
            )}
          </ApolloConsumer>
        )}
      </Mutation>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Item</ModalHeader>
        <ModalBody>
          <p>Test</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { toggleModal(); }}>Add Missing Item</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
