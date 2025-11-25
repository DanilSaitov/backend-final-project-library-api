import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { bookRoutes } from './routes/bookRoutes.js';
import { authorRoutes } from './routes/authorRoutes.js';
import { genreRoutes } from './routes/genreRoutes.js';
import { reservationRoutes } from './routes/reservationRoutes.js';
import { loanRoutes } from './routes/loanRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const specs = YAML.load('./public/bundled.yaml');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Library Management API Documentation'
}));

// Serve bundled spec for external tools
app.use('/api', express.static('./public'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/genres', genreRoutes);
app.use('/reservations', reservationRoutes);
app.use('/loans', loanRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});



app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});