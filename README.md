# openBankAPI
TypeScript API RESTful para nutrir o front-end do openBank

```mermaid
classDiagram
    class User {
        - name: string
        - email: string
        - password: string
        - status: boolean
        - cpf: int
        - cnpj: int
        - Account: Account
        - Features: Feature[]
        - Transactions: Transaction[]
    }

    class Account {
        - accountId: int
        - accountNumber: int
        - agency: int
        - limit: float
    }

    class Feature {
        - name: string
        - active: boolean
        - icon: string
    }

    class Transaction {
        - transactionId: int
        - date: string
        - value: float
        - cashback: float
        - Account: Account
    }

    User --|> Account
    User --|> Feature
    User --|> Transaction
    Transaction --> Account : accountId

```
