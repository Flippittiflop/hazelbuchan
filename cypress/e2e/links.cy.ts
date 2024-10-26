describe('Link Checker', () => {
  const pages = [
    '/',
    '/design',
    '/paper-advertising',
    '/paper-events',
    '/illustration',
    '/contact',
    '/impressum',
    '/privacy-policy',
    '/terms-and-conditions',
  ];

  pages.forEach((page) => {
    describe(`Page: ${page}`, () => {
      beforeEach(() => {
        cy.visit(page);
      });

      it('should not have any broken links', () => {
        cy.get('a').each(($link) => {
          const href = $link.prop('href');
          if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            cy.request(href).its('status').should('be.lt', 400);
          }
        });
      });

      it('should not have any broken images', () => {
        cy.get('img').each(($img) => {
          cy.wrap($img)
            .should('be.visible')
            .and(($img) => {
              expect($img[0].naturalWidth).to.be.greaterThan(0);
            });
        });
      });

      it('should have alt text for all images', () => {
        cy.get('img').each(($img) => {
          cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
        });
      });
    });
  });

  it('should have valid meta tags', () => {
    cy.visit('/');
    cy.get('head meta[name="description"]').should('exist');
    cy.get('head meta[name="viewport"]').should('exist');
    cy.get('head meta[charset="utf-8"]').should('exist');
  });
});