import { useEffect, useRef } from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Button from 'react-bootstrap/Button'
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { useLogoutMutation, useResendEmailCodeMutation, useUpdateEmailMutation, useUpdateUserMutation, useVerifyEmailMutation } from "../services/api"
import { VerificationComponent } from "./Verification"
import { useLoggedinUser } from '../utils/hooks'

export default function Profile() {

    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const user = useLoggedinUser();
    
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user]);   

    function handleLogout() {
        logout();
    }

    if (!user) {
        return;
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
    const user = useLoggedinUser();

    return (
        <Card className="mx-auto mt-3 col-md-8" >
            <Card.Body>
                <Stack direction="vertical" gap={3}>
                    <div className="d-flex justify-content-between border-bottom border-secondary-subtle">
                            <Stack direction="vertical">
                            <p className="fw-medium">{user?.email}</p>
                            <p className="text-secondary fs-6">Email</p>
                        </Stack>
                        <Link className="btn btn-text" to='update/email'><i className="bi bi-pencil-fill" /></Link>
                    </div>

                    <div className="d-flex justify-content-between">
                        <Stack direction="vertical">
                            <p className="fw-medium">{user?.name}</p>
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
        updateEmail({ newEmail: email });
    }

    if (!isLoading && data) {
        navigate('/profile/verify/email', { state: { email: refEmail.current.value }});
        return null;
    }

    return (
        <Card className="mt-3 mx-auto col-md-8">
            <Card.Body>
                <Form onSubmit={handleSubmit} noValidate={true}>
                    <fieldset disabled={isLoading} >
                        <Form.Group>
                            <FloatingLabel label='New Email' controlId="inputNewEmail" className={ !isLoading && error?.newEmail && 'is-invalid' }>
                                <Form.Control ref={refEmail} type="email" required placeholder="" className={ !isLoading && error?.newEmail && 'is-invalid' } />
                            </FloatingLabel>
                            { !isLoading && error?.newEmail && <Form.Control.Feedback type="invalid">{error?.newEmail}</Form.Control.Feedback>}
                        </Form.Group>
                        
                        <Button varient='primary' className='mt-4 w-100' type='submit'>Change</Button>
                    </fieldset>
                </Form>
            </Card.Body>
        </Card>
    )
}

export function EmailVerification() {

    const [verifyEmail, { error, isLoading, data}] = useVerifyEmailMutation();
    const [ resendEmailCode] = useResendEmailCodeMutation();
    const { state } = useLocation();
    const navigate = useNavigate();

    function handleSubmit(code) {
        verifyEmail(code);
    }

    if (!isLoading && data) {
        navigate('/profile', { replace: true });
        return null;
    }

    return <VerificationComponent disabled={isLoading} email={state?.email} canResendCode={true} onSubmit={handleSubmit} 
            onResendCode={resendEmailCode} feedback={error?.code} />
}

export function UpdateName() {

    const [updateUser, { isLoading, data }] = useUpdateUserMutation();
    const refName = useRef();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (!e.target.checkValidity()) {
            return;
        }
        const name = refName.current.value;
        updateUser({name});
    }

    if (!isLoading && data) {
        navigate('/profile', { replace: true });
        return null;
    }
    
    return (
        <Card className="mt-3 mx-auto col-md-8">
            <Card.Body>
                <Form onSubmit={handleSubmit} noValidate={true}>
                    <fieldset disabled={isLoading} >
                        <FloatingLabel label='Name' controlId="inputName">
                            <Form.Control ref={refName} type="text" required placeholder="" />
                        </FloatingLabel>
                        
                        <Button varient='primary' className='mt-4 w-100' type='submit'>Change</Button>
                    </fieldset>
                </Form>
            </Card.Body>
        </Card>
    )
}