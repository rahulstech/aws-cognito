import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Login from './features/login/Login'
import { useRef, useState } from 'react'
import Signup from './features/signup/Signup'

function App() {
  
  const [activeTab, setActiveTab] = useState('login');

  function handleChangeTab(tab) {
    setActiveTab(tab);
  }

  return (
    <Container fluid className='vh-100 bg-secondary-subtle' >
      <Row className='h-100 align-items-center justify-content-center'>
        <Col md='6' >
          <Card>
            <Card.Header>
              <Nav activeKey={activeTab} fill variant='tabs' onSelect={handleChangeTab}>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Signup</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              { activeTab === 'login' ? <Login /> : <Signup /> }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App
