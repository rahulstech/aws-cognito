import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import { useRef } from 'react';

export default function Login() {

    const refEmail = useRef();
    const refPassword = useRef();

    function handleLogin(e) {
        e.preventDefault();

        const email = refEmail.current.value;
        const password = refPassword.current.value;

        console.log('email ', email, ' password ', password);
    }

    return (
        <Form  onSubmit={handleLogin} noValidate={true}>
            <fieldset>
                <Stack direction='vertical' gap='3'>

                    <Form.Group>
                        <FloatingLabel label='Email'>
                            <Form.Control ref={refEmail} type='email' placeholder='Enter your login email' required />
                        </FloatingLabel>
                        <Form.Control.Feedback type=''></Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <FloatingLabel label='Password'>
                            <Form.Control ref={refPassword} type='password' placeholder='Password' required />
                        </FloatingLabel>
                        <Form.Control.Feedback type=''></Form.Control.Feedback>
                    </Form.Group>
                    <a href='#' className='text-end'>Forget Password</a>
                </Stack>
                <Button type='submit' className='w-100 mt-5'>Login</Button>
            </fieldset>
        </Form>
    )
}