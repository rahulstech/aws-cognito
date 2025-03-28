import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Login from './Login'
import Signup from './Signup'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLoggedinUser } from '../utils/hooks'

export default function SigninSignup() {

    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();
    const user = useLoggedinUser();
    
    useEffect(() => {
      if (user) {
          navigate('/profile');
      }
    }, [user]);
    

    function handleChangeTab(tab) {
        setActiveTab(tab);
    }

    if (user) {
      return null;
    }
    
    return (
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
    )
}