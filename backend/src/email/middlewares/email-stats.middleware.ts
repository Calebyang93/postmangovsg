import { Request, Response, NextFunction } from 'express'
import { EmailStatsService } from '@email/services'
/**
 * Gets stats for email campaign
 * @param req 
 * @param res 
 * @param next 
 */
const getStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { campaignId } = req.params
  try {
    const stats = await EmailStatsService.getStats(+campaignId)
    return res.json(stats)
  } catch (err) {
    next(err)
  }
}

export const EmailStatsMiddleware = {
  getStats,
}