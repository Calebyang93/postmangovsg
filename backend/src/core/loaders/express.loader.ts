import cors from 'cors'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { errors as celebrateErrorMiddleware } from 'celebrate'
import morgan from 'morgan'

import config from '@core/config'
import v1Router from '@core/routes'
import logger from '@core/logger'
import { clientIp, userId } from '@core/utils/morgan'

const FRONTEND_URL = config.get('frontendUrl')

/**
 * Returns a regex or a string used by cors to determine if requests comes from allowed origin
 * @param v 
 */
const origin = (v: string): string | RegExp  => {
  if (v.startsWith('/') && v.endsWith('/')){
    // Remove the leading and trailing slash
    return new RegExp(v.substring(1, v.length-1))
  }
  return v
}

morgan.token('client-ip', clientIp)
morgan.token('user-id', userId)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const loggerMiddleware = morgan(config.get('MORGAN_LOG_FORMAT'), { stream: logger.stream })


const expressApp = ({ app }: { app: express.Application }): void => {
  app.use(loggerMiddleware)

  app.use(bodyParser.json())
  // ref: https://expressjs.com/en/resources/middleware/cors.html#configuration-options
  // Default CORS setting:
  // {
  //   "origin": "*",
  //   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   "preflightContinue": false,
  //   "optionsSuccessStatus": 204
  // }
  app.use(cors({
    origin: origin(FRONTEND_URL),
    credentials: true, // required for setting cookie
  }))

  app.get('/', async (_req: Request, res: Response) => {
    return res.sendStatus(200)
  })

  app.use('/v1', v1Router)
  app.use(celebrateErrorMiddleware())

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(`${JSON.stringify(err.stack, null, 4)}`)
    return res.sendStatus(500)
  })

  logger.info({ message: 'Express routes loaded' })
}

export default expressApp