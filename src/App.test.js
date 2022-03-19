import App from './App';
import { render, fireEvent } from '@testing-library/react'

it('should display "Hello, Bob!" after entering name', () => {
  const { getByText, getByLabelText } = render(<App />);

  const nameInput = getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: 'Bob' } })

  fireEvent.click(getByText(/submit/i))

  const expectedMessage = "Hello, Bob!";
  expect(getByText(expectedMessage)).toBeDefined()
});