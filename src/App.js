// import React from 'react';
// import './App.css';

// function App() {

//   const [displayMessage, setDisplayMessage] = React.useState(false);
//   const [name, setName] = React.useState("");

//   return (
//     <div className="App">
//       <label htmlFor="name">Name</label>
//       <input id="name" type="text" onChange={(event) => setName(event.currentTarget.value)} />
//       <button onClick={() => setDisplayMessage(true)}>Submit</button>
      
//       {displayMessage && <p>{`Hello, ${name}!`}</p>}
//     </div>
//   );
// }

// export default App;

import React from 'react';
import './App.css';
import Order from './components/Order';
import Loading from './components/Loading';
import Payment from './components/Payment';
import { Consumer } from "./context/LoadingContext";

function App() {
  return (
    <Consumer>
      {context => (
        <div className="app">
            <div className="app__body container">
                <div className="row">
                    <div className="col-lg-10 m-auto">
                        <div className="app__card row">
                            { context.isLoading ? (
                                [<Order key='Order'/>,<Loading key="Loading"/>]
                            ) : (
                                [<Order key='Order'/>,<Payment key="Payment"/>]
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </Consumer>
  );
}

App.contextType = Consumer;

export default App;
