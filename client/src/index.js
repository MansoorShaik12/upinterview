// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';
// import { Auth0Provider } from '@auth0/auth0-react';
// import PermifyConfig from './permifyConfig';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ProfileProvider } from './Context/ProfileContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Router>
//     <ProfileProvider>
//       <PermifyConfig>
//         <Auth0Provider
//           domain="dev-niskaip8y4c68yht.us.auth0.com"
//           clientId="tCOgxwRPpniDMhLmN7oYFonIIMqx92GR"
//           authorizationParams={{
//             redirect_uri: 'http://localhost:3002/profile3'
//           }}
//         >
//           <App />
//         </Auth0Provider>
//       </PermifyConfig>
//     </ProfileProvider>
//   </Router>
// );



// // src/index.js

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App';
// import './index.css';

// ReactDOM.render(
//   <Router>
//     <App />
//   </Router>,
//   document.getElementById('root')
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import PermifyConfig from './permifyConfig';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProfileProvider } from './Context/ProfileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ProfileProvider>
      <PermifyConfig>
        <Auth0Provider
          domain="dev-niskaip8y4c68yht.us.auth0.com"
          clientId="tCOgxwRPpniDMhLmN7oYFonIIMqx92GR"
          authorizationParams={{
            redirect_uri: `${window.location.origin}/callback`
          }}
        >
          <App />
        </Auth0Provider>
      </PermifyConfig>
    </ProfileProvider>
  </Router>
);
