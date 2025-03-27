import { useEffect, useRef } from "react"
import appStorage from "../app/Storage"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Button from 'react-bootstrap/Button'
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { useUpdateEmailMutation, useVerifyEmailMutation } from "../services/api"
import { VerificationComponent } from "./Verification"

export default function Profile() {

    const navigate = useNavigate();

    const user = appStorage.getLoggedinUser();
    
    useEffect(() => {
        if (!appStorage.hasLoggedinUser()) {
            navigate('/');
        }
    }, []);   

    function handleLogout() {
        appStorage.clearCurrentLogin();
        navigate('/');
        return null;
    }

    if (!appStorage.hasLoggedinUser()) {
        navigate('/');
        return null;
    }

    return (
        <>
            <Navbar className='bg-primary px-4' fixed="top" >
                <Navbar.Brand as={Link} to='/profile'>{user?.name}</Navbar.Brand>
                <Nav className="w-100 justify-content-end">
                    <Nav.Link onClick={handleLogout} >Logout</Nav.Link>
                </Nav>
            </Navbar>
            <main style={{ paddingTop: '56px' }}>
                <Outlet />
            </main>
        </>
    )
}


export function ProfileHome() {

    const { email, name } = appStorage.getLoggedinUser();
    const navigate = useNavigate();

    return (
        <Card className="mx-auto mt-3 col-md-8" >
            <Card.Body>
                <Stack direction="vertical" gap={3}>
                    <div className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle">
                            <Stack direction="vertical">
                            <p className="fw-medium">{email}</p>
                            <p className="text-secondary fs-6">Email</p>
                        </Stack>
                        <Link className="btn btn-text" to='update/email'><i className="bi bi-pencil-fill" /></Link>
                    </div>

                    <div className="d-flex justify-content-between">
                        <Stack direction="vertical">
                            <p className="fw-medium">{name}</p>
                            <p className="text-secondary fs-6">Name</p>
                        </Stack>
                        <Link className="btn btn-text" to='update/name'><i className="bi bi-pencil-fill" /></Link>
                    </div>
                </Stack>
            </Card.Body>
        </Card>
    )
}

export function UpdateEmail() {

    const [updateEmail, { error, isLoading, data}] = useUpdateEmailMutation();
    const refEmail = useRef();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            return;
        }

        const email = refEmail.current.value;
        updateEmail(email);
    }

    if (!isLoading && data) {
        navigate('/verify/email', { state: { email: refEmail.current.value }});
        return null;
    }

    return (
        <Card className="mt-3 mx-auto col-md-8">
            <Card.Body>
                <Form onSubmit={handleSubmit} noValidate={true}>
                    <fieldset >
                        <Form.Group>
                            <FloatingLabel label='New Email' controlId="inputNewEmail" className={ !isLoading && error?.email && 'is-invalid' }>
                                <Form.Control ref={refEmail} type="email" required placeholder="" className={ !isLoading && error?.email && 'is-invalid' } />
                            </FloatingLabel>
                            { !isLoading && error?.email && <Form.Control.Feedback type="invalid">{error?.email}</Form.Control.Feedback>}
                        </Form.Group>
                        
                        <Button varient='primary' className='mt-4 w-100' type='submit'>Change</Button>
                    </fieldset>
                </Form>
            </Card.Body>
        </Card>
    )
}

export function VerifyEmail() {

    const [verifyEmail, { error, isLoading, data}] = useVerifyEmailMutation();
    const { state } = useLocation();
    const navigate = useNavigate();

    function handleSubmit(code) {
        verifyEmail(code);
    }

    function handleResendCode() {

    }

    if (!isLoading && data) {
        navigate('/profile', { replace: true });
        return null;
    }

    return <VerificationComponent disabled={isLoading} email={state?.email} canResendCode={true} onSubmit={handleSubmit} 
            onResendCode={handleResendCode} feedback={error?.code} />
}

export function UpdateName() {
    return <p>Update name</p>
}