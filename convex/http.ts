import {httpRouter} from "convex/server"
import {auth} from "./auth"

export const http = httpRouter()

auth.addHttpRoutes(http)

export default http
