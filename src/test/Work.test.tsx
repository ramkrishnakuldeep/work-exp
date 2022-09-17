import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Work from '../components/Work';
import uuid from "react-uuid";

const logoPreviewUrl: any = "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png";

const onWorkFormUpdate = () => {
  console.log('onWorkFormUpdate')
}
const onRemoveWork = jest.fn();

const onCompanyLogoUpdate = () => {
  console.log('onCompanyLogoUpdate')
}

const workExpObj = {
  id: uuid(),
  startDate: "",
  endDate: "",
  company: "",
  src: logoPreviewUrl,
  jobTitle: "",
  jobDescription: "",
};

const props = {
  key: uuid(),
  workExp: workExpObj,
  onWorkFormUpdate,
  onRemoveWork,
  onCompanyLogoUpdate,
}

test('work experience component', async () => {
  const view = render(<Work {...props} />);
  const button = screen.getAllByRole('button');
  expect(button.length).toEqual(1);
  fireEvent.click(button[0]);
  await waitFor(() => view);
  const button2 = screen.getAllByRole('button');
  expect(button2.length).toEqual(0);
});
