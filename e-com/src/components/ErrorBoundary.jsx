import { Component } from 'react';
import { Container, Title, Text, Button } from '@mantine/core';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="md" py="xl">
          <Title order={2}>Bir şeyler yanlış gitti</Title>
          <Text mt="md">Üzgünüz, bir hata oluştu. Lütfen sayfayı yenileyin.</Text>
          <Button 
            mt="xl"
            onClick={() => window.location.reload()}
          >
            Sayfayı Yenile
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
} 