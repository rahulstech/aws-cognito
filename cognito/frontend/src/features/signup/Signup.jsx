import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLable from 'react-bootstrap/FloatingLabel'
import Stack from 'react-bootstrap/Stack'
import { useRef } from 'react'

export default function Signup() {

    const refEmail = useRef();
    const refPassword = useRef();
    const refName = useRef();
    

    function handleSignup(e) {
        e.preventDefault();

        const email = refEmail.current.value;
        const password = refPassword.current.value;
        const name = refName.current.value;

        console.log('email ', email, ' password ', password, ' name ', name);
    }

    return (
        <Form onSubmit={handleSignup} noValidate={true}>
            <fieldset>
                <Stack direction='vertical' gap={3}>
                    <Form.Group>
                        <FloatingLable label='Email'>
                            <Form.Control ref={refEmail} type='email' placeholder='Email' required />
                        </FloatingLable>
                        <Form.Control.Feedback type=''></Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <FloatingLable label='Password'>
                            <Form.Control ref={refPassword} type='password' placeholder='Password' required />
                        </FloatingLable>
                        <Form.Control.Feedback type=''></Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <FloatingLable label='Name'>
                            <Form.Control ref={refName} type='personname' placeholder='Name' required />
                        </FloatingLable>
                        <Form.Control.Feedback type=''></Form.Control.Feedback>
                    </Form.Group>
                </Stack>
                <Button type='submit' className='mt-4 w-100'>Signup</Button>
            </fieldset>
        </Form>
    )
}