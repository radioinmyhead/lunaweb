require('./css.css');
import React from 'react';
import ReactDOM from 'react-dom';
import Superagent from 'superagent';

class ProductCategoryRow extends React.Component {
  render() {
    return <tr><th colSpan="2">{this.props.category}</th></tr>;
  }
}
class ProductRow extends React.Component {
  render() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span>{this.props.product.name}</span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
}
class ProductTable extends React.Component {
  render() {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach((product) => {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange() {
    this.props.onUserInput(
      this.filterTextInput.value,
      this.inStockOnlyInput.checked
    );
  }
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref={(input) => this.filterTextInput = input}
          onChange={this.handleChange} />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref={(input) => this.inStockOnlyInput = input}
            onChange={this.handleChange}
            />
          {' '}Only show products in stock
       </p>
      </form>
    );
  }
}
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: "",
      inStockOnly: false,
    };
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
          />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          />
      </div>
    );
  }
}

class Load extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "/api",
      stat: '',
      data: null
    }
  }
  componentDidMount() {
    Superagent.get(this.state.url).end(function (err, res) {
      if (err){
        this.setState({
          stat:'fail',
          data:"get fail: "+JSON.stringify(err)
        });
      }else{
        this.setState({
          stat:'succ',
          data:res.body
        });
      }
    }.bind(this));
  }
  render() {
    if (this.state.stat =='succ') {
      //return <span> {JSON.stringify(this.state.data)} </span>;
      return <FilterableProductTable products={this.state.data} />;
    } else if (this.state.stat=='fail') {
      return <span>{this.state.data}</span>;
    } else {
      return <span>Loading</span>;
    }
  }
}

ReactDOM.render(
  <div>
    <Load />
  </div>,
  document.getElementById('root')
);