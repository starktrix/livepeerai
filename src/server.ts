import app from "./app";
import connect from "./config/database";
import config from "./config/env"


const PORT = config.PORT

// app.listen(PORT, () => {
//     console.log(`[server started]: Listening on port ${PORT}`)
// })


connect(`${config.MONGODB_URI}`).then(() => {
    console.log("[database]: database is up ⚡")
    app.listen(PORT, () => {
        console.log(`[server started]: Listening on port ${PORT}`)
    })
}).catch(() => {
    console.log("[database]: Error staritng starting db ❌")
})