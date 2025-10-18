# Тестування проекту

Цей документ описує підхід до тестування у проекті Weather App, структуру тестів та рекомендації щодо написання нових тестів.

## Загальний підхід

Проект використовує Jest як основний фреймворк для тестування разом з Testing Library для тестування React компонентів. Всі тести розташовані поруч з файлами, які вони тестують, у папці `__tests__`.

Основні принципи тестування у проекті:

- Ізоляція тестів через мокування зовнішніх залежностей
- Тестування поведінки замість імплементації
- Використання реальних користувацьких взаємодій
- Перевірка доступності та UX

## Структура тестів

### Unit тести

Unit тести покривають окремі функції та утиліти. Вони не залежать від зовнішніх систем і виконуються максимально швидко.

**localStorage utils (src/utils/**tests**/localStorage.test.ts)**

Тестується робота з браузерним localStorage:

- Завантаження даних з localStorage
- Збереження даних
- Додавання нового міста
- Видалення міста
- Обробка помилок при невалідних даних

Кожен тест використовує `beforeEach` для очищення localStorage, що гарантує незалежність тестів один від одного.

**Redux slice (src/store/**tests**/citiesSlice.test.ts)**

Тестується Redux логіка управління містами:

- Початковий стан
- Додавання міста до списку
- Видалення міста зі списку
- Ініціалізація списку з localStorage
- Обробка дублікатів

Slice тести перевіряють що редюсери правильно змінюють стан і синхронізуються з localStorage.

### Інтеграційні тести

Інтеграційні тести перевіряють роботу компонентів з реальними (або мокованими) залежностями.

**CityCard компонент (src/components/CityCard/**tests**/CityCard.test.tsx)**

Тестується картка міста з погодною інформацією:

- Відображення стану завантаження
- Відображення даних про погоду
- Обробка помилок завантаження
- Кнопка оновлення даних
- Кнопка видалення міста
- Навігація на детальну сторінку

Компонент взаємодіє з Redux store та RTK Query, тому використовуються моки для API запитів.

**AddCityForm компонент (src/components/AddCityForm/**tests**/AddCityForm.test.tsx)**

Тестується форма додавання нового міста:

- Рендеринг форми
- Активація кнопки при введенні тексту
- Валідація порожнього вводу
- Додавання міста після успішної валідації
- Очищення поля після додавання

Форма використовує RTK Query для валідації міста через API, що також мокується у тестах.

## Конфігурація тестування

### Jest конфігурація

Файл `jest.config.ts` містить основні налаштування:

```typescript
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};
```

Основні параметри:

- `testEnvironment: 'jsdom'` - використання браузерного оточення для React компонентів
- `setupFilesAfterEnv` - файл з глобальними налаштуваннями для тестів
- `moduleNameMapper` - підтримка alias `@/` для імпортів
- `modulePathIgnorePatterns` - ігнорування build папки

### Setup файл

Файл `jest.setup.ts` налаштовує тестове оточення:

```typescript
import '@testing-library/jest-dom';
import 'whatwg-fetch';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

Цей файл:

- Додає кастомні matchers від Testing Library
- Додає polyfill для fetch API
- Мокує IntersectionObserver (потрібен для Material UI)
- Мокує matchMedia (потрібен для responsive компонентів)

## Моки

### Структура моків

Всі моки винесені у окрему папку `src/__mocks__` для переважного використання:

```
__mocks__/
├── api/
│   └── weatherApiMocks.ts      # Мокані відповіді API
├── data/
│   └── cityMocks.ts            # Тестові дані міст
├── navigation/
│   └── routerMocks.ts          # Моки для Next.js router
├── store/
│   └── storeMocks.ts           # Конфігурація тестового store
└── index.ts                    # Експорт всіх моків
```

### API моки

Файл `weatherApiMocks.ts` містить типові відповіді від OpenWeatherMap API:

```typescript
export const mockWeatherResponse: WeatherResponse = {
  id: 703448,
  name: 'Київ',
  sys: { country: 'UA' },
  main: {
    temp: 20,
    feels_like: 19,
    humidity: 65,
    pressure: 1013,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'ясно',
      icon: '01d',
    },
  ],
  wind: { speed: 3.5 },
};
```

Ці моки використовуються у тестах компонентів для симуляції API відповідей.

### Store моки

Функція `createMockStore` створює тестовий Redux store з попередньо налаштованим станом:

```typescript
export const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      cities: citiesReducer,
      weatherApi: weatherApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(weatherApi.middleware),
  });
};
```

Це дозволяє створювати ізольовані store для кожного тесту з потрібним початковим станом.

### Router моки

Для тестування компонентів, що використовують Next.js router, створені mock функції:

```typescript
export const mockRouterPush = jest.fn();
export const mockRouterBack = jest.fn();

export const resetRouterMocks = () => {
  mockRouterPush.mockClear();
  mockRouterBack.mockClear();
};
```

У тестах Next.js router мокується через `jest.mock`:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    back: mockRouterBack,
  }),
}));
```

## Запуск тестів

### Основні команди

**Одноразовий запуск всіх тестів:**

```bash
npm test
```

**Watch режим для розробки:**

```bash
npm run test:watch
```

**Генерація звіту про покриття:**

```bash
npm run test:coverage
```

Після виконання команди coverage у папці `coverage/` з'являється детальний звіт. HTML версію можна відкрити у браузері: `coverage/lcov-report/index.html`

**CI режим:**

```bash
npm run test:ci
```

Використовується у GitHub Actions. Запускає тести один раз без watch mode.

### Інтерпретація результатів

Після запуску тестів ви побачите вивід у форматі:

```
PASS  src/utils/__tests__/localStorage.test.ts
PASS  src/store/__tests__/citiesSlice.test.ts
PASS  src/components/CityCard/__tests__/CityCard.test.tsx
PASS  src/components/AddCityForm/__tests__/AddCityForm.test.tsx

Test Suites: 4 passed, 4 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.682 s
```

Зелений текст `PASS` означає що всі тести у файлі пройшли успішно.

Звіт coverage показує відсоток покритого коду:

```
------------------------|---------|----------|---------|---------|
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files               |   77.66 |    90.9  |   70    |   77.66 |
 citiesSlice.ts         |   100   |    100   |   100   |   100   |
 localStorage.ts        |   94.87 |   72.72  |   100   |   94.87 |
 weatherApi.ts          |   77.5  |    100   |   60    |   77.5  |
------------------------|---------|----------|---------|---------|
```

## Написання нових тестів

### Загальні рекомендації

При написанні нових тестів слід дотримуватися наступних принципів:

1. Один тест перевіряє одну поведінку
2. Назва тесту описує що саме перевіряється
3. Тести незалежні один від одного
4. Використовуйте `beforeEach` для підготовки тестового оточення
5. Тестуйте поведінку, а не імплементацію

### Шаблон тесту компонента

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { YourComponent } from '../YourComponent';
import { createMockStore } from '@/__mocks__';

describe('YourComponent', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <YourComponent />
      </Provider>
    );

    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    render(
      <Provider store={store}>
        <YourComponent />
      </Provider>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(screen.getByText('Updated text')).toBeInTheDocument();
  });
});
```

### Шаблон тесту утиліти

```typescript
import { yourFunction } from '../yourFile';

describe('yourFunction', () => {
  it('should return expected result for valid input', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    const result = yourFunction(null);
    expect(result).toBe(null);
  });

  it('should throw error for invalid input', () => {
    expect(() => yourFunction('invalid')).toThrow();
  });
});
```

## Поширені проблеми

### Act warnings

Якщо у консолі з'являються попередження про `act(...)`, це означає що компонент оновлює стан асинхронно. Рішення:

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Updated text')).toBeInTheDocument();
});
```

### Моки не працюють

Переконайтеся що моки викликаються перед імпортом компонента:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

import { YourComponent } from '../YourComponent';
```

### Тести падають випадково

Можливо тести залежать один від одного. Переконайтеся що кожен тест очищає стан у `beforeEach` або `afterEach`.

## CI/CD інтеграція

Тести автоматично запускаються у GitHub Actions при кожному push та pull request. Конфігурація знаходиться у `.github/workflows/ci.yml`.

Якщо тести не проходять, merge блокується. Це гарантує що у main гілці завжди робочий код.

## Покращення покриття

Щоб покращити покриття тестами:

1. Запустіть `npm run test:coverage`
2. Відкрийте `coverage/lcov-report/index.html`
3. Знайдіть файли з низьким покриттям
4. Додайте тести для непокритих шляхів коду

Ціль - мінімум 80% покриття для критичного коду (utils, store, основні компоненти).
