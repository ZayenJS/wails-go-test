import React, { useEffect, useState } from 'react';
import './App.css';
import HelloWorld from './components/HelloWorld';

function App() {
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [prods, setProds] = useState([]);

  const getProds = () => {
    window.backend.getProducts().then((res) => setProds(res));
  };

  useEffect(() => {
    if (!prods.length) window.backend.getProducts().then((res) => setProds(res));
  }, [prods]);

  const save = (e) => {
    e.preventDefault();
    window.backend.createProduct(code, +price);
    getProds();
    setCode('');
    setPrice('');
  };

  return (
    <div id="app" className="App">
      <header className="App-header">
        <form onSubmit={save}>
          <input
            placeholder="code"
            type="text"
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
          <p>{code}</p>
          <input
            placeholder="price"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <p>{price}</p>
          <button>save</button>
        </form>
        <button onClick={getProds}>get prods</button>
        <div>
          {prods.map((prod) => (
            <div key={prod.ID}>
              <p>code: {prod.Code}</p>
              <p>price: {prod.Price}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
