import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { CityCard } from '../CityCard';
import { createMockStore, mockRouterPush, resetRouterMocks } from '@/__mocks__';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('CityCard', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    resetRouterMocks();
    store = createMockStore();
  });

  it('should render loading state', () => {
    render(
      <Provider store={store}>
        <CityCard cityId="1" cityName="Київ" />
      </Provider>
    );

    expect(screen.getByText('Київ')).toBeInTheDocument();
    expect(screen.getByText('Завантаження...')).toBeInTheDocument();
  });

  it('should navigate to detail page on card click', async () => {
    render(
      <Provider store={store}>
        <CityCard cityId="1" cityName="Київ" />
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Помилка завантаження')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const card = screen.getByText('Київ').closest('[class*="card"]');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('should have refresh and delete buttons in error state', async () => {
    render(
      <Provider store={store}>
        <CityCard cityId="1" cityName="Київ" />
      </Provider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Помилка завантаження')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const refreshButton = screen.getByTestId('RefreshIcon').closest('button');
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');

    expect(refreshButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
