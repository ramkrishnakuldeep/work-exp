import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

const headerText = 'Years of Experience'

test('renders learn react link', () => {
  render(<Header />);
  const linkElement = screen.getByText(headerText);
  expect(linkElement).toBeInTheDocument();
});
