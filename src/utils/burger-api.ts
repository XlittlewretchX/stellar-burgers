import { getCookie, setCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';
import ingredientsFixture from '../data/mock-ingredients.json';

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

type TUserResponse = TServerResponse<{ user: TUser }>;

type TStoredUser = TUser & { password: string };
type TStoredOrder = TOrder & {
  ownerEmail: string;
  autoProgress?: boolean;
};

type TResetPasswordSession = {
  email: string;
  token: string;
  expiresAt: number;
};

const REQUEST_DELAY_MIN_MS = 180;
const REQUEST_DELAY_MAX_MS = 650;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const DEFAULT_ORDER_COUNTER = 38483;
const ACCESS_TOKEN_KEY = 'mock-access-token';
const REFRESH_TOKEN_KEY = 'mock-refresh-token';

const STORAGE_KEYS = {
  users: 'stellar-burgers:mock-users',
  sessionEmail: 'stellar-burgers:mock-session-email',
  orders: 'stellar-burgers:mock-orders',
  orderCounter: 'stellar-burgers:mock-order-counter',
  resetPasswordSession: 'stellar-burgers:mock-reset-password-session',
  resetTokenPreview: 'stellar-burgers:mock-reset-token-preview'
};

export const MOCK_RESET_TOKEN_STORAGE_KEY = STORAGE_KEYS.resetTokenPreview;

const DEFAULT_USER: TStoredUser = {
  email: 'mainbum@oldbumbarbershop.ru',
  name: 'OldBum',
  password: '123456'
};

const randomDelay = (): number =>
  Math.floor(
    REQUEST_DELAY_MIN_MS +
      Math.random() * (REQUEST_DELAY_MAX_MS - REQUEST_DELAY_MIN_MS)
  );

const wait = <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), randomDelay());
  });

const rejectWithError = (message: string): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), randomDelay());
  });

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string): boolean => password.length >= 6;

const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

const removeStorage = (key: string): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
};

type TIngredientFixture = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v?: number;
};

type TIngredientsFixture = {
  success: boolean;
  data: TIngredientFixture[];
};

const normalizedIngredients = (
  ingredientsFixture as TIngredientsFixture
).data.map(
  ({
    _id,
    name,
    type,
    proteins,
    fat,
    carbohydrates,
    calories,
    price,
    image,
    image_large,
    image_mobile
  }): TIngredient => ({
    _id,
    name,
    type,
    proteins,
    fat,
    carbohydrates,
    calories,
    price,
    image,
    image_large,
    image_mobile
  })
);

const createToken = (type: 'access' | 'refresh', email: string): string => {
  const key = type === 'access' ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY;
  const raw = `${key}:${encodeURIComponent(email)}:${Date.now()}`;
  return type === 'access' ? `Bearer ${raw}` : raw;
};

const parseTokenEmail = (
  token: string | null | undefined,
  type: 'access' | 'refresh'
): string | null => {
  if (!token) {
    return null;
  }

  const normalizedToken = token.replace(/^Bearer\s+/i, '');
  const [tokenKey, encodedEmail] = normalizedToken.split(':');
  const expectedKey = type === 'access' ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY;

  if (tokenKey !== expectedKey || !encodedEmail) {
    return null;
  }

  try {
    return decodeURIComponent(encodedEmail);
  } catch {
    return null;
  }
};

const parseNameFromEmail = (email: string): string => {
  const [name] = email.split('@');
  return name || 'Пользователь';
};

const getIngredientById = (id: string): TIngredient | undefined =>
  normalizedIngredients.find((item) => item._id === id);

const toPublicOrder = (order: TStoredOrder): TOrder => ({
  _id: order._id,
  status: order.status,
  name: order.name,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  number: order.number,
  ingredients: order.ingredients
});

const createOrderId = (): string =>
  `mock-order-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const getMaxOrderNumber = (orders: TStoredOrder[]): number =>
  orders.reduce(
    (max, order) => Math.max(max, order.number),
    DEFAULT_ORDER_COUNTER - 1
  );

const getSessionEmail = (): string | null =>
  readStorage<string | null>(STORAGE_KEYS.sessionEmail, null);

const setSessionEmail = (email: string | null): void => {
  if (email) {
    writeStorage(STORAGE_KEYS.sessionEmail, email);
  } else {
    removeStorage(STORAGE_KEYS.sessionEmail);
  }
};

const getResetPasswordSession = (): TResetPasswordSession | null =>
  readStorage<TResetPasswordSession | null>(
    STORAGE_KEYS.resetPasswordSession,
    null
  );

const setResetPasswordSession = (
  session: TResetPasswordSession | null
): void => {
  if (session) {
    writeStorage(STORAGE_KEYS.resetPasswordSession, session);
  } else {
    removeStorage(STORAGE_KEYS.resetPasswordSession);
  }
};

const ensureUsers = (): TStoredUser[] => {
  const users = readStorage<TStoredUser[]>(STORAGE_KEYS.users, []);

  if (!users.length) {
    const seeded = [DEFAULT_USER];
    writeStorage(STORAGE_KEYS.users, seeded);
    return seeded;
  }

  if (!users.some((user) => user.email === DEFAULT_USER.email)) {
    const nextUsers = [DEFAULT_USER, ...users];
    writeStorage(STORAGE_KEYS.users, nextUsers);
    return nextUsers;
  }

  return users;
};

const saveUsers = (users: TStoredUser[]): void => {
  writeStorage(STORAGE_KEYS.users, users);
};

const formatOrderName = (ingredientIds: string[]): string => {
  const bun = ingredientIds
    .map((id) => getIngredientById(id))
    .find((item) => item?.type === 'bun');
  const main = ingredientIds
    .map((id) => getIngredientById(id))
    .find((item) => item?.type === 'main');

  if (bun?.name && main?.name) {
    return `${bun.name} с ${main.name.toLowerCase()}`;
  }

  if (bun?.name) {
    return `${bun.name} бургер`;
  }

  return 'Космический бургер';
};

const createTimestamp = (minutesAgo: number): string =>
  new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

const createSeedOrders = (): TStoredOrder[] => {
  const bun1 = '643d69a5c3f7b9001cfa093c';
  const bun2 = '643d69a5c3f7b9001cfa093d';
  const main1 = '643d69a5c3f7b9001cfa0941';
  const main2 = '643d69a5c3f7b9001cfa093f';
  const main3 = '643d69a5c3f7b9001cfa0946';
  const main4 = '643d69a5c3f7b9001cfa0948';
  const sauce1 = '643d69a5c3f7b9001cfa0942';
  const sauce2 = '643d69a5c3f7b9001cfa0943';
  const sauce3 = '643d69a5c3f7b9001cfa0944';
  const sauce4 = '643d69a5c3f7b9001cfa0945';

  const ingredientSets: string[][] = [
    [bun1, sauce1, main1, bun1],
    [bun2, sauce3, main3, bun2],
    [bun1, sauce2, main2, bun1],
    [bun2, sauce4, main4, bun2],
    [bun1, sauce3, main4, bun1],
    [bun2, sauce1, main1, bun2]
  ];

  const owners = [
    DEFAULT_USER.email,
    'guest@stellar-burger.ru',
    'pilot@stellar-burger.ru',
    'captain@stellar-burger.ru',
    'navigator@stellar-burger.ru'
  ];

  const statuses: TOrder['status'][] = ['done', 'pending', 'created'];

  return Array.from({ length: 18 }, (_, index) => {
    const ingredients = ingredientSets[index % ingredientSets.length];
    const status = statuses[index % statuses.length];
    const createdAt = createTimestamp(8 + index * 11);

    return {
      _id: createOrderId(),
      status,
      name: formatOrderName(ingredients),
      createdAt,
      updatedAt: createdAt,
      number: DEFAULT_ORDER_COUNTER - 1 - index,
      ingredients,
      ownerEmail: owners[index % owners.length]
    };
  });
};

const getAutoProgressStatus = (createdAt: string): TOrder['status'] => {
  const age = Date.now() - new Date(createdAt).getTime();
  if (age < 30_000) {
    return 'created';
  }
  if (age < 90_000) {
    return 'pending';
  }
  return 'done';
};

const saveOrders = (orders: TStoredOrder[]): void => {
  writeStorage(STORAGE_KEYS.orders, orders);
};

const syncOrderLifecycle = (orders: TStoredOrder[]): TStoredOrder[] => {
  let hasChanges = false;
  const updatedAt = new Date().toISOString();

  const nextOrders = orders.map((order) => {
    if (!order.autoProgress) {
      return order;
    }

    const nextStatus = getAutoProgressStatus(order.createdAt);
    if (nextStatus === order.status) {
      return order;
    }

    hasChanges = true;
    return {
      ...order,
      status: nextStatus,
      updatedAt
    };
  });

  if (hasChanges) {
    saveOrders(nextOrders);
  }

  return nextOrders;
};

const ensureOrders = (): TStoredOrder[] => {
  const storedOrders = readStorage<TStoredOrder[]>(STORAGE_KEYS.orders, []);
  if (!storedOrders.length) {
    const seededOrders = createSeedOrders();
    saveOrders(seededOrders);
    writeStorage(
      STORAGE_KEYS.orderCounter,
      getMaxOrderNumber(seededOrders) + 1
    );
    return seededOrders;
  }

  const orders = syncOrderLifecycle(storedOrders);
  const savedCounter = readStorage<number>(
    STORAGE_KEYS.orderCounter,
    DEFAULT_ORDER_COUNTER
  );
  const nextCounter = getMaxOrderNumber(orders) + 1;

  if (savedCounter < nextCounter) {
    writeStorage(STORAGE_KEYS.orderCounter, nextCounter);
  }

  return orders;
};

const getNextOrderNumber = (): number => {
  const orders = ensureOrders();
  const fallback = getMaxOrderNumber(orders) + 1;
  const counter = readStorage<number>(STORAGE_KEYS.orderCounter, fallback);
  const nextCounter = Math.max(counter + 1, fallback + 1);

  writeStorage(STORAGE_KEYS.orderCounter, nextCounter);

  return Math.max(counter, fallback);
};

const getCurrentUser = (): TStoredUser | null => {
  const accessToken = getCookie('accessToken');
  if (!accessToken) {
    return null;
  }

  const users = ensureUsers();
  const tokenEmail = parseTokenEmail(accessToken, 'access');
  const sessionEmail = getSessionEmail();
  const legacyEmail = accessToken === 'lorem' ? DEFAULT_USER.email : null;
  const resolvedEmail = tokenEmail || sessionEmail || legacyEmail;

  if (!resolvedEmail) {
    return null;
  }

  const user = users.find((item) => item.email === resolvedEmail);
  if (!user) {
    return null;
  }

  if (sessionEmail !== user.email) {
    setSessionEmail(user.email);
  }

  return user;
};

const buildFeedResponse = (orders: TStoredOrder[]): TFeedsResponse => {
  const publicOrders = orders
    .map(toPublicOrder)
    .sort((a, b) => b.number - a.number);

  const today = new Date().toDateString();
  const totalToday = publicOrders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  ).length;

  return {
    success: true,
    orders: publicOrders,
    total: publicOrders.length,
    totalToday
  };
};

export const refreshToken = async (): Promise<TRefreshResponse> => {
  const storedRefreshToken =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('refreshToken')
      : null;

  if (!storedRefreshToken) {
    return rejectWithError('Сессия истекла. Войдите снова');
  }

  const users = ensureUsers();
  const refreshTokenEmail = parseTokenEmail(storedRefreshToken, 'refresh');
  const sessionEmail = getSessionEmail();
  const resolvedEmail = refreshTokenEmail || sessionEmail;
  const user = users.find((item) => item.email === resolvedEmail);

  if (!user) {
    return rejectWithError('Сессия истекла. Войдите снова');
  }

  const refreshToken = createToken('refresh', user.email);
  const accessToken = createToken('access', user.email);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken);
  }
  setCookie('accessToken', accessToken);
  setSessionEmail(user.email);

  return wait({
    success: true,
    refreshToken,
    accessToken
  });
};

export const fetchWithRefresh = async <T>(
  _url: RequestInfo,
  _options: RequestInit
): Promise<T> =>
  Promise.reject(
    new Error('Локальный режим: прямые сетевые запросы отключены')
  );

export const getIngredientsApi = async (): Promise<TIngredient[]> => {
  const response: TIngredientsResponse = {
    success: true,
    data: normalizedIngredients
  };
  return wait(response.data);
};

export const getFeedsApi = async (): Promise<TFeedsResponse> =>
  wait(buildFeedResponse(ensureOrders()));

export const getOrdersApi = async (): Promise<TOrder[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return rejectWithError('Вы не авторизованы');
  }

  const orders = ensureOrders()
    .filter((order) => order.ownerEmail === currentUser.email)
    .map(toPublicOrder)
    .sort((a, b) => b.number - a.number);

  return wait(orders);
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = async (
  ingredientIds: string[]
): Promise<TNewOrderResponse> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return rejectWithError('Вы не авторизованы');
  }

  if (!ingredientIds.length) {
    return rejectWithError('Добавьте ингредиенты для заказа');
  }

  const validIngredients = ingredientIds.filter((id) =>
    Boolean(getIngredientById(id))
  );

  if (validIngredients.length !== ingredientIds.length) {
    return rejectWithError('Некоторые ингредиенты не найдены');
  }

  const hasBun = validIngredients.some(
    (id) => getIngredientById(id)?.type === 'bun'
  );

  if (!hasBun) {
    return rejectWithError('Сначала выберите булку');
  }

  const createdAt = new Date().toISOString();
  const order: TStoredOrder = {
    _id: createOrderId(),
    status: 'created',
    name: formatOrderName(validIngredients),
    createdAt,
    updatedAt: createdAt,
    number: getNextOrderNumber(),
    ingredients: validIngredients,
    ownerEmail: currentUser.email,
    autoProgress: true
  };

  const allOrders = ensureOrders();
  saveOrders([order, ...allOrders]);

  return wait({
    success: true,
    name: order.name,
    order: toPublicOrder(order)
  });
};

export const getOrderByNumberApi = async (
  number: number
): Promise<TOrderResponse> => {
  const order = ensureOrders().find((item) => item.number === number);
  if (!order) {
    return rejectWithError('Заказ не найден');
  }

  return wait({
    success: true,
    orders: [toPublicOrder(order)]
  });
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = async (
  data: TRegisterData
): Promise<TAuthResponse> => {
  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();
  const password = data.password.trim();

  if (!isValidEmail(email)) {
    return rejectWithError('Введите корректный email');
  }

  if (!isValidPassword(password)) {
    return rejectWithError('Пароль должен быть не короче 6 символов');
  }

  if (!name) {
    return rejectWithError('Введите имя');
  }

  const users = ensureUsers();
  if (users.some((user) => user.email === email)) {
    return rejectWithError('Пользователь с таким email уже существует');
  }

  const user: TStoredUser = {
    email,
    name,
    password
  };

  saveUsers([...users, user]);

  return wait({
    success: true,
    refreshToken: createToken('refresh', user.email),
    accessToken: createToken('access', user.email),
    user: {
      email: user.email,
      name: user.name
    }
  });
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = async (
  data: TLoginData
): Promise<TAuthResponse> => {
  const email = data.email.trim().toLowerCase();
  const password = data.password.trim();

  if (!email || !password) {
    return rejectWithError('Введите email и пароль');
  }

  const users = ensureUsers();
  const user = users.find((item) => item.email === email);

  if (!user || user.password !== password) {
    return rejectWithError('Неверный email или пароль');
  }

  setSessionEmail(user.email);

  return wait({
    success: true,
    refreshToken: createToken('refresh', user.email),
    accessToken: createToken('access', user.email),
    user: {
      email: user.email,
      name: user.name
    }
  });
};

export const forgotPasswordApi = async (data: {
  email: string;
}): Promise<TServerResponse<{}>> => {
  const email = data.email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return rejectWithError('Введите корректный email');
  }

  const users = ensureUsers();
  const user = users.find((item) => item.email === email);

  if (!user) {
    return rejectWithError('Пользователь с таким email не найден');
  }

  const token = String(Math.floor(100000 + Math.random() * 900000));

  setResetPasswordSession({
    email: user.email,
    token,
    expiresAt: Date.now() + RESET_TOKEN_TTL_MS
  });
  writeStorage(STORAGE_KEYS.resetTokenPreview, token);

  return wait({
    success: true
  });
};

export const resetPasswordApi = async (data: {
  password: string;
  token: string;
}): Promise<TServerResponse<{}>> => {
  const password = data.password.trim();
  const token = data.token.trim();
  const resetSession = getResetPasswordSession();

  if (!isValidPassword(password)) {
    return rejectWithError('Пароль должен быть не короче 6 символов');
  }

  if (!token) {
    return rejectWithError('Введите код из письма');
  }

  if (!resetSession) {
    return rejectWithError('Запрос на сброс пароля не найден');
  }

  if (Date.now() > resetSession.expiresAt) {
    setResetPasswordSession(null);
    removeStorage(STORAGE_KEYS.resetTokenPreview);
    return rejectWithError('Срок действия кода истек');
  }

  if (token !== resetSession.token) {
    return rejectWithError('Неверный код восстановления');
  }

  const users = ensureUsers();
  const nextUsers = users.map((user) =>
    user.email === resetSession.email ? { ...user, password } : user
  );
  saveUsers(nextUsers);

  setResetPasswordSession(null);
  removeStorage(STORAGE_KEYS.resetTokenPreview);

  return wait({
    success: true
  });
};

export const getUserApi = async (): Promise<TUserResponse> => {
  const user = getCurrentUser();
  if (!user) {
    return rejectWithError('Вы не авторизованы');
  }

  return wait({
    success: true,
    user: {
      email: user.email,
      name: user.name
    }
  });
};

export const updateUserApi = async (
  data: Partial<TRegisterData>
): Promise<TUserResponse> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return rejectWithError('Вы не авторизованы');
  }

  const nextEmail = data.email?.trim().toLowerCase() || currentUser.email;
  const nextName = data.name?.trim() || currentUser.name;
  const nextPassword = data.password?.trim() || currentUser.password;

  if (data.email && !isValidEmail(nextEmail)) {
    return rejectWithError('Введите корректный email');
  }

  if (data.password && !isValidPassword(nextPassword)) {
    return rejectWithError('Пароль должен быть не короче 6 символов');
  }

  const users = ensureUsers();

  if (nextEmail !== currentUser.email) {
    const emailBusy = users.some((user) => user.email === nextEmail);
    if (emailBusy) {
      return rejectWithError('Пользователь с таким email уже существует');
    }
  }

  const updatedUser: TStoredUser = {
    email: nextEmail,
    name: nextName,
    password: nextPassword
  };

  const nextUsers = users.map((user) =>
    user.email === currentUser.email ? updatedUser : user
  );
  saveUsers(nextUsers);

  if (nextEmail !== currentUser.email) {
    const nextOrders = ensureOrders().map((order) =>
      order.ownerEmail === currentUser.email
        ? { ...order, ownerEmail: nextEmail }
        : order
    );
    saveOrders(nextOrders);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(
      'refreshToken',
      createToken('refresh', updatedUser.email)
    );
  }
  setCookie('accessToken', createToken('access', updatedUser.email));
  setSessionEmail(updatedUser.email);

  return wait({
    success: true,
    user: {
      email: updatedUser.email,
      name: updatedUser.name
    }
  });
};

export const logoutApi = async (): Promise<TServerResponse<{}>> => {
  setSessionEmail(null);
  setResetPasswordSession(null);
  removeStorage(STORAGE_KEYS.resetTokenPreview);
  return wait({
    success: true
  });
};
