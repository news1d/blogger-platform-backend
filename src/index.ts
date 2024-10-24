import {app} from './app'
import {SETTINGS} from "./settings";
import {runDb} from "./db/mongoDb";


const startApp = async () => {
    const res = await runDb()

    if (!res){
        process.exit(1)
    }

    app.listen(SETTINGS.PORT, () => {
        console.log(`Server is running on port ${SETTINGS.PORT}`);
    })
}

startApp();