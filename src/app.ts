import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

class App {
  public app: Express;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (req, res) => {
      res.status(200).json({ message: 'Hello World!' });
    });
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  public start(PORT: number | string): void {
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export { App };

// importação necessária para o teste
export const { app } = new App();
