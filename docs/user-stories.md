### Historia de Usuario: [Título]

Como [rol]
Quiero [acción]
Para [beneficio]

#### Criterios de Aceptación:

1. Dado [contexto]
   Cuando [evento]
   Entonces [resultado]

#### Notas Técnicas:

- Componentes necesarios
- Modelos de datos
- Interacciones

---

Key functions (draft):

1. Register a bid

- As a user I want to register my bid to view commission data
- 1. Given I am logged in/authenticated, when I click on the "add an item" button, then the "register item" modal pops up
- 2. Given I fill the "register item" form, when I click on "submit", then the modal closes and a dashboard displays

2. Display bid in a dashboard

- 1. Given I've registed a new item, when the dashboard displays, then I should see the commissions calculation

3. View registered bids in /History

- 1. Given I've registerd a new item, when I navigate to "history", then I can view my recently listed item
