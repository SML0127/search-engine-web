import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import MainPage from '../Main/MainPage';

class AuthRoute extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const obj = this;
    return (
      <Route
        render={props =>
          obj.props.authenticated ? (
            <MainPage userId={obj.props.userId}/>
          ) : (
            <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
            />
          )
        }
      />
    );
  }
}
export default AuthRoute;




// function AuthRoute({ authenticated, component: Component, render, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         authenticated ? (
//           render ? render(props) : <Component {...props} />
//         ) : (
//           <Redirect
//             to={{ pathname: '/login', state: { from: props.location } }}
//           />
//         )
//       }
//     />
//   );
// }

// export default AuthRoute;
