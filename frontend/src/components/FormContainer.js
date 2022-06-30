import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function FormContainer({ md, children }) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={md}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
