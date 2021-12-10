import app from './app'
import { env } from 'process';

app.listen(process.env.PORT || "4000")

console.log(`Server up on http://localhost:${env.PORT || "4000"}`);