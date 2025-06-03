import Cypress from 'cypress';

const API_ENDPOINT = 'https://norma.nomoreparties.space/api';
const BUN_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ALT_BUN_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const INGREDIENT_SELECTOR = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;

beforeEach(() => {
  cy.intercept('GET', `${API_ENDPOINT}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${API_ENDPOINT}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_ENDPOINT}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modalContainer');
});

describe('Burger Constructor Functionality', () => {
  describe('Ingredient Counter Behavior', () => {
    it('should increment ingredient counter when added', () => {
      cy.get(INGREDIENT_SELECTOR).children('button').click();
      cy.get(INGREDIENT_SELECTOR).find('.counter__num').should('contain', '1');
    });
  });

  describe('Ingredient Addition Scenarios', () => {
    it('should allow adding bun and filling in any order', () => {
      cy.get(BUN_SELECTOR).children('button').click();
      cy.get(INGREDIENT_SELECTOR).children('button').click();
    });

    it('should handle filling addition before bun selection', () => {
      cy.get(INGREDIENT_SELECTOR).children('button').click();
      cy.get(BUN_SELECTOR).children('button').click();
    });
  });

  describe('Bun Replacement Scenarios', () => {
    it('should replace bun when no fillings are present', () => {
      cy.get(BUN_SELECTOR).children('button').click();
      cy.get(ALT_BUN_SELECTOR).children('button').click();
    });

    it('should replace bun while preserving existing fillings', () => {
      cy.get(BUN_SELECTOR).children('button').click();
      cy.get(INGREDIENT_SELECTOR).children('button').click();
      cy.get(ALT_BUN_SELECTOR).children('button').click();
    });
  });
});

describe('Order Processing', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-token');
    cy.setCookie('accessToken', 'test-access-token');
    cy.getAllLocalStorage().should('exist');
    cy.getCookie('accessToken').should('exist');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('should process order and display order number', () => {
    cy.get(BUN_SELECTOR).children('button').click();
    cy.get(INGREDIENT_SELECTOR).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modalContainer').find('h2').should('contain', '38483');
  });

  it('should close order modal and clear constructor after order', () => {
    cy.get(BUN_SELECTOR).children('button').click();
    cy.get(INGREDIENT_SELECTOR).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modalContainer').find('h2').should('contain', '38483');
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
    cy.get(BUN_SELECTOR).find('.counter__num').should('not.exist');
    cy.get(INGREDIENT_SELECTOR).find('.counter__num').should('not.exist');
  });
});

describe('Modal Window Interactions', () => {
  it('should display ingredient details in modal', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(INGREDIENT_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });

  it('should close modal via close button', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(INGREDIENT_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('not.be.empty');
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('should close modal via overlay click', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(INGREDIENT_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('not.be.empty');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modalContainer').should('be.empty');
  });

  it('should close modal via Escape key', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(INGREDIENT_SELECTOR).children('a').click();
    cy.get('@modalContainer').should('not.be.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });
}); 