import Container from 'react-bootstrap/Container'
import { Verification } from './components/Verification'
import { createBrowserRouter, RouterProvider } from 'react-router'
import SigninSignup from './components/SigninSignup'
import { Provider } from 'react-redux'
import appStore from './app/AppStore'
import Profile, { ProfileHome, UpdateEmail, UpdateName } from './components/Profile'
import { ForgetPassword, PasswordVerification, ResetPassword } from './components/PasswordReset'
import { SigupVerification } from './components/Signup'


const router = createBrowserRouter([
  { path: '', element: <SigninSignup /> },
  { path: '/verify', element: <Verification />, 
    children: [
      { path: '', element: <SigupVerification />},
      { path: 'password', element: <PasswordVerification /> }
    ]
  },
  { path: '/forgetpassword', element: <ForgetPassword /> },
  { path: '/resetpassword', element: <ResetPassword /> },
  { path: '/profile', element: <Profile />, 
    children: [
      { path: '', element: <ProfileHome /> },
      { path: 'update/email', element: <UpdateEmail /> },
      { path: 'update/name', element: <UpdateName /> }
    ]
  }
]);

export default function App() {
  
  return (
    <Provider store={appStore}>
      <Container fluid className='vh-100 bg-secondary-subtle' style={{ minWidth: '440px'}} >
        <RouterProvider router={router} />
      </Container>
    </Provider>
  )
}
