export const mockRouterPush = jest.fn();

export const mockRouterBack = jest.fn();

export const mockRouterReplace = jest.fn();

export const mockRouter = {
  push: mockRouterPush,
  back: mockRouterBack,
  replace: mockRouterReplace,
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  beforePopState: jest.fn(),
  prefetch: jest.fn(),
  reload: jest.fn(),
};

export const setupNavigationMocks = () => {
  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));
};

export const resetRouterMocks = () => {
  mockRouterPush.mockClear();
  mockRouterBack.mockClear();
  mockRouterReplace.mockClear();
};
