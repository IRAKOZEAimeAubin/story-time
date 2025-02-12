import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import auth from './routes/auth.js';
import chalk from 'chalk';

const port = process.env.PORT || 9001;
const info = chalk.hex( '#60a5fa' );

const app = express();

app.use( helmet() );
app.use( cors() );

app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );


app.use( '/api/auth', auth );

app.listen( port, () => console.log( info( `Server is running on port ${ port }...` ) ) );
