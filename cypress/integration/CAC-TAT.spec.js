/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function () {
        cy.title().should('include', 'Central de Atendimento ao Cliente TAT')
    })
    it('Preenche o formulário e verifica se o botão está habilitado', function () {
        const longString =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam lacinia, nunc nisl lacinia nisl, quis aliquam nisl nisl quis nisl. Nulla euismod, nisl quis aliquam lacinia, nunc nisl lacinia nisl, quis aliquam nisl nisl quis nisl.'
        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Teste')
        cy.get('#email').type('teste@teste.com')
        cy.get('#open-text-area').type(longString, { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida ', function () {
        const longString =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam lacinia, nunc nisl lacinia nisl, quis aliquam nisl nisl quis nisl. Nulla euismod, nisl quis aliquam lacinia, nunc nisl lacinia nisl, quis aliquam nisl nisl quis nisl.'
        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Teste')
        cy.get('#email').type('teste@teste,com')
        cy.get('#open-text-area').type(longString, { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não numérico ', function () {
        cy.get('#phone').type('teste').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Teste')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Teste')
            .should('have.value', 'Teste')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Teste')
            .should('have.value', 'Teste')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('teste@teste.com')
            .should('have.value', 'teste@teste.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area')
            .type('teste')
            .should('have.value', 'teste')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check('feedback')
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(($el, index, $list) => {
                cy.wrap($el).check().should('be.checked')
            })
    })

    //Outro modelo de teste
    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.eq('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {
                action: 'drag-drop',
            })
            .should(function ($input) {
                expect($input[0].files[0].name).to.eq('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('fileContent')
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@fileContent')
            .should(function ($input) {
                expect($input[0].files[0].name).to.eq('example.json')
            })
    })

    it('verifica que a pol�tica de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a p�gina da pol�tica de privacidade removendo o target e ent�o clicando no link', function () {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()

        cy.contains('Talking About Testing').should('be.visible')
    })
})
