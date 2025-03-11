import express, {Express} from 'express';
import aiRoutes from './routes/routes'

const app: Express = express();
app.use(express.json());


const port: number = 8081;


app.use('/api', aiRoutes)


app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})