import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './App.css';
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CSVLink } from "react-csv";

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
`

// let result = inventory.find(item => {
//   return item.sku === this.state.sku
// })

let inventory = [
  {
    "name": "Salomon Mtn Lab",
    "sku": 110
  },
  {
    "name": "Salomon Shift",
    "sku": 91
  },
  {
    "name": "Patagonia Down Sweater",
    "sku": 81
  },
  {
    "name": "Patagonia Down Sweater",
    "sku": 81
  },
];

let columns = [{
  Header: 'Name',
  accessor: 'name' // String-based value accessors!
}, {
  Header: 'Sku',
  accessor: 'sku',
}]


class App extends Component {
  state = {
    modal: false,
    scannedFound: [],
    scannedMissing: [],
    inventory,
    name: '',
    sku: '',
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  checkForSKU = () => {
    let skuIndex = inventory.findIndex(item => item.sku === this.state.sku);
    if (skuIndex !== -1) {
      this.setState(state => {
      let scannedFoundItem = inventory.find(item => item.sku === this.state.sku);
      let scannedFound = state.scannedFound.concat(scannedFoundItem);
        return {
          scannedFound,
        };
      });

      this.setState(state => {
        inventory = state.inventory.filter((_, index) => index !== skuIndex);
        return {
          inventory,
        };
      });
    }
    else {
      this.toggle()
    }
  }

  addScannedMissing = () => {
    console.log("addScannedMissing");
    this.setState(state => {
      let scannedMissing = state.scannedMissing.concat({name: this.state.name, sku: this.state.sku});
      return {
        scannedMissing,
      };
    });
  }

  render() {
    return (
      <Container>
      <form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // change them to the single item page
              console.log(this.state.sku);
              this.checkForSKU();
            }}
          >
            <fieldset>
              {/* <label htmlFor="file">
                Upload CSV from Rain
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload a file"
                  required
                  onChange={this.uploadFile}
                />
              </label> */}

              <label htmlFor="sku">
                SKU
                <input
                  type="number"
                  id="sku"
                  name="sku"
                  placeholder="sku"
                  required
                  value={this.state.sku}
                  onChange={this.handleChange}
                />
              </label>
              {/* <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter A Description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label> */}
              <Button color="primary" type="submit">Check SKU</Button>
              <Button color="secondary" onClick={this.toggle}>Add Item</Button>
              <CSVLink data={this.state.scannedMissing}>Download CSV of missing items</CSVLink>
            </fieldset>
          </form>
          <p>Initial inventory from Rain POS</p>
          <ReactTable data={this.state.inventory} columns={columns} defaultPageSize={5}/>
          <p>Scanned items found in inventory</p>
          <ReactTable data={this.state.scannedFound} columns={columns} defaultPageSize={5}/>
          <p>Scanned items missing from inventory</p>
          <ReactTable data={this.state.scannedMissing} columns={columns} defaultPageSize={5}/>


          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Add Item</ModalHeader>
                <ModalBody>
                <form
                  onSubmit={async e => {
                    // Stop the form from submitting
                    e.preventDefault();
                    // change them to the single item page
                    this.addScannedMissing();
                    console.log(this.state.name + this.state.sku);
                  }}
                >
                  <fieldset>
                  <label htmlFor="name">
                      Name
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Product Name"
                        required
                        value={this.state.name}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="sku">
                      SKU
                      <input
                        type="number"
                        id="sku"
                        name="sku"
                        placeholder="SKU"
                        required
                        value={this.state.sku}
                        onChange={this.handleChange}
                      />
                    </label>
                    </fieldset>
              </form>

                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={() => { this.addScannedMissing(); this.toggle();}}>Add Missing Item</Button>{' '}
                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
              </Modal>

          </Container>


    );
  }
}

export default App;
