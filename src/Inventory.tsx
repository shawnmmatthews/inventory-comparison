import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { buildSubscription } from "aws-appsync";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { listItems } from "./graphql/queries";
import { ListItemsQuery, ListItemsQueryVariables } from "./API";
import { OnMount } from "./components/OnMount";
import { onCreateItem, onUpdateItem } from "./graphql/subscriptions";
import { CheckSkuForm } from "./CheckSkuForm"

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

export const Inventory = () => {
  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab: any) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }

  return (
    <>
      <CheckSkuForm />
      <Query<ListItemsQuery, ListItemsQueryVariables>
        query={gql(listItems)}
      >
        {({ data, loading, subscribeToMore }) => {
          if (loading) {
            return (<p>Loading data from AWS...</p>)
          }

          else if (
            !data ||
            !data.listItems ||
            !data.listItems.items
          ) {
            return null;
          }

          let items: any = data.listItems.items;
          let inventory: any = items.filter((item: any) => item.inventory === true);
          let scannedFound: any = items.filter((item: any) => item.scannedFound === true);;
          let scannedMissing: any = items.filter((item: any) => item.scannedMissing === true);;

          return (
            <>
              <OnMount
                onEffect={() => {
                  return subscribeToMore(
                    buildSubscription(gql(onUpdateItem), gql(listItems))
                  )
                }}
              />
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => { toggleTab('1'); }}
                  >
                    Items Not Scanned
            </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => { toggleTab('2'); }}
                  >
                    Scanned Items Found
            </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => { toggleTab('3'); }}
                  >
                    Scanned Items Missing
            </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <ReactTable data={inventory} columns={columns} defaultPageSize={5} />
                </TabPane>
                <TabPane tabId="2">
                  <ReactTable data={scannedFound} columns={columns} defaultPageSize={5} />
                </TabPane>
                <TabPane tabId="3">
                  <ReactTable data={scannedMissing} columns={columns} defaultPageSize={5} />
                </TabPane>
              </TabContent>
            </>
          );
        }}
      </Query>
    </>
  );
};
