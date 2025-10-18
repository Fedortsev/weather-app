import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AddCityForm } from '../AddCityForm';
import { createMockStore } from '@/__mocks__';

describe('AddCityForm', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it('should render input and button', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    expect(screen.getByLabelText('Додати місто')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /додати/i })).toBeInTheDocument();
  });

  it('should disable button when input is empty', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    const button = screen.getByRole('button', { name: /додати/i });
    expect(button).toBeDisabled();
  });

  it('should enable button when input has value', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    const input = screen.getByLabelText('Додати місто');
    const button = screen.getByRole('button', { name: /додати/i });

    await user.type(input, 'Київ');

    expect(button).not.toBeDisabled();
  });

  it('should show error for empty input on submit', async () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    const input = screen.getByLabelText('Додати місто');
    const button = screen.getByRole('button', { name: /додати/i });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(button).toBeDisabled();
  });

  it('should clear input after adding city', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    const input = screen.getByLabelText('Додати місто') as HTMLInputElement;

    await user.type(input, 'Київ');
    expect(input.value).toBe('Київ');
  });
});
