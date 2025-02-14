import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import chalk from 'chalk';
import root from './routes/root.js';
import health from './routes/health.js';
import auth from './routes/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './helpers/swagger.js';

const port = process.env.PORT || 9001;
const info = chalk.hex( '#60a5fa' );

const app = express();

app.use( helmet() );
app.use( cors() );

app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

app.use( '/', root );
app.use( '/health', health );
app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec ) );
app.use( '/api/auth', auth );

app.listen( port, () => console.log( info( `Server is running on port ${ port }...` ) ) );
