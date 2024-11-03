import express, { Request, Response } from 'express' 
import winston from 'winston';



export function runApp() {
winston.info("Hello via Bun!");

const PORT = parseInt(process.env.PORT ?? '5476');

const app = express();

app.set('view-engine', 'ejs');

const indexProps = {
	ioServer: {
		host: 'http://localhost:6476',
		urlPath: '/socket.io/socket.io.js'
	}
};

app.get('/', (req: Request, res: Response) => {
	res.render('index.ejs', {props: indexProps});
});

app.listen(PORT, () => {
	winston.info(`Listening on port ${PORT}`);
});

};

