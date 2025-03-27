import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import { useRef } from 'react';
import { useLoginMutation } from '../services/api';
import FloatingLabelPasswordControl from './FloatingLabelPasswordControl';
import { useNavigate } from 'react-router';

export default function Login() {

    const [login, { error, isLoading, data }] = useLoginMutation();

    const refEmail = useRef();
    const refPassword = useRef();
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            return;
        }

        const email = refEmail.current.value;
        const password = refPassword.current.value;

        login({ email, password });
    }

    if (!isLoading) {
        if (error?.statusCode === 403) {
            // user exists but not verified, redirect to signup verification
            navigate('/verify', { state: { email: refEmail.current.value, password: refPassword.current.value }});
            return null;
        }
        else if (data) {
            navigate('/profile');
            return null;
        }
    }
    
    return (
        <Form  onSubmit={handleLogin} noValidate={true}>
            <fieldset disabled={isLoading}>
                <Stack direction='vertical' gap='3'>
                    <Form.Group>
                        <FloatingLabel controlId='loginEmail' label='Email' className={ !isLoading && error?.email && 'is-invalid'}>
                            <Form.Control ref={refEmail} type='email' placeholder='Enter your login email' 
                                className={ !isLoading && error?.email && 'is-invalid'} required />
                        </FloatingLabel>
                        <Form.Control.Feedback type='invalid'>{error?.email}</Form.Control.Feedback>
                    </Form.Group>

                    <FloatingLabelPasswordControl required ref={refPassword} label='Password' 
                        feedback={error?.password} />
                    
                    <a href='/forgetpassword' className='text-end'>Forget Password</a>
                </Stack>
                <Button type='submit' className='w-100 mt-5'>Login</Button>
            </fieldset>
        </Form>
    )
}