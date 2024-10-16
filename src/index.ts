import {app} from './app'
import {SETTINGS} from "./settings";

app.listen(SETTINGS.PORT, () => {
    console.log(`Server is running on port ${SETTINGS.PORT}`);
})