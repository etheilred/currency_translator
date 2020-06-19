import React, { Component } from 'react';
import SymbolSelector from './components/SymbolSelector'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: 'USD',
      loaded: false,
      error: null,
      value: 1,
      symbol: 'USD',
      rates: {},
      symbols: [],
      excResult: 'Try typing in value and selecting currency symbol...'
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onSymbolChange = this.onSymbolChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onBaseChange = this.onBaseChange.bind(this)
  }

  componentDidMount() {
    fetch("https://api.ratesapi.io/api/latest?base=USD")
      .then(resp => resp.json())
      .then(exRates => {
        this.setState({
          symbols: [...Object.keys(exRates.rates), 'USD'],
          symbol: Object.keys(exRates.rates)[0],
          rates: exRates.rates,
          loaded: true,
          base: exRates.base
        })
      })
      .catch(x => {
        this.setState({
          loaded: true,
          error: x
        })
      })
  }

  onValueChange(e) {
    // alert(+e.target.value)
    this.setState({
      value: +e.target.value
    });
  }

  onSymbolChange(e) {
    // alert(e.target.value)
    this.setState({
      symbol: e.target.value
    });
  }

  onBaseChange(e) {
    this.setState({
      base: e.target.value
    });
  }

  onFormSubmit(e) {
    e.preventDefault()
    if (Number.isNaN(this.state.value) || this.state.value < 0) {
      this.setState({
        excResult: `${this.state.value} is not a valid value, try entering a valid number`
      });
      return;
    }
    fetch("https://api.ratesapi.io/api/latest?base=USD")
      .then(resp => resp.json())
      .then(rates => {
        this.setState({
          excResult: `${this.state.value} ${this.state.base} is ${(this.state.value * rates.rates[this.state.symbol]).toFixed(2)} ${this.state.symbol}`
        })
      });
  }

  render() {
    const { symbols, loaded, error } = this.state;
    if (!loaded) {
      return (
        <div class="App">
          <h2>Loading...</h2>
        </div>
      );
    } else if (error) {
      return (
        <div class="App">
          <h2>{error}</h2>
        </div>
      )
    }
    return (
      <div class="App">
        <section class="content">
          <div class="form">
            <form onSubmit={this.onFormSubmit}>
              <div id="form-inner">
                <div id="selectors">
                  <SymbolSelector symbols={symbols} onChange={this.onBaseChange} default={this.state.base} />
                  <span id="to">To</span>
                  <SymbolSelector symbols={symbols} onChange={this.onSymbolChange} default={this.state.symbol} />
                </div>
                <div id="input-field">
                  <input id="value" type="text" placeholder="Value" onChange={this.onValueChange} />
                  <div id="btn-submit">
                    <input type="submit" value="Translate" />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="exchangeResult">
            <h2>{this.state.excResult}</h2>
          </div>
        </section>
        <footer class="footer">
          &copy; 2020 Etheilred
        </footer>
      </div>
    );
  }
}

export default App;