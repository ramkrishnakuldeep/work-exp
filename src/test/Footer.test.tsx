import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

const headerText = 'Years of Experience'

test('renders learn react link', () => {
  render(
    <Footer>
      <button></button>
      <button></button>
      <button></button>
    </Footer>
    );
  const linkElement = screen.getAllByRole('button');
  expect(linkElement.length).toEqual(3);
});
