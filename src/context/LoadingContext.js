import React from "react";
const { Provider, Consumer } = React.createContext();

function LoadingContextProvider(props) {

  const [isLoading, setIsLoading] = React.useState(false);

  return (
      <Provider
        value={{ isLoading, setIsLoading }}
      >
        {props.children}
      </Provider>
  );
}

export { LoadingContextProvider, Consumer };
