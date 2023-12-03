import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [inputData, setInputData] = useState({
    feEmail: '',
    feVerificationCode: '',
  });

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(null);

  const handlesData = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/users/check', inputData);
      setIsCodeSent(true);
    } catch (err) {
      const errors = err.response.data.Error;
      setError(errors);
    }
  };

  const handleCode = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/users/code', inputData);
      navigate('/home');
    } catch (err) {
      const errors = err.response.data.Error;
      setError(errors);
    }
  };

  return (
    <>
      <Container>
        <section className='d-flex align-items-center justify-content-center vh-100'>
          {!isCodeSent ? (
            <>
              <Form onSubmit={(e) => handlesData(e)}>
                <Form.Group>
                  <Form.Label> Email: </Form.Label>
                  <Form.Control
                    type='text'
                    className='mb-2'
                    value={inputData.feEmail}
                    onChange={(e) =>
                      setInputData({ ...inputData, feEmail: e.target.value })
                    }
                  />
                </Form.Group>
                {error && <span className='text-danger'>{error}</span>}
                <Form.Group>
                  <Button type='submit'>Send Code</Button>
                </Form.Group>
              </Form>
            </>
          ) : (
            <>
              <Form onSubmit={(e) => handleCode(e)}>
                <Form.Group>
                  <Form.Label> Verify Code: </Form.Label>
                  <Form.Control
                    type='text'
                    className='mb-2'
                    placeholder='Code was sent to your email'
                    value={inputData.feVerificationCode}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        feVerificationCode: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                {error && <span className='text-danger'>{error}</span>}
                <Form.Group>
                  <Button type='submit'>Submit</Button>
                </Form.Group>
              </Form>
            </>
          )}
        </section>
      </Container>
    </>
  );
};

export default Register;
