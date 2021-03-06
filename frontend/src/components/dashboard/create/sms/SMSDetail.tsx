import React, { useState, useEffect } from 'react'

import { Status, CampaignStats } from 'classes/Campaign'
import { getCampaignStats, stopCampaign, retryCampaign } from 'services/campaign.service'
import { ProgressDetails } from 'components/common'

const SMSDetail = ({ id, sentAt, numRecipients }: { id: number; sentAt: Date; numRecipients: number }) => {

  const [stats, setStats] = useState(new CampaignStats({}))

  async function refreshCampaignStats() {
    const campaignStats = await getCampaignStats(+id)
    setStats(campaignStats)
    return campaignStats
  }

  async function handlePause(){
    try{
      await stopCampaign(id)
      await refreshCampaignStats()
    } catch(err) {
      console.error(err)
    }
  }

  async function handleRetry(){
    try{
      await retryCampaign(id)
      await refreshCampaignStats()
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    async function poll() {
      const { status } = await refreshCampaignStats()

      if (status !== Status.Sent) {
        timeoutId = setTimeout(poll, 2000)
      }
    }

    poll()
    return () => {
      timeoutId && clearTimeout(timeoutId)
    }
  }, [stats.status])

  return (
    <>
      {
        stats.status === Status.Sending ?
          (<>
            <h2>Your campaign is being sent out now!</h2>
            <p>It may take a few minutes to complete. You can leave this page in the meantime,
            and check on the progress by returning to this page from the Campaigns tab.</p>
          </>
          ) :
          (<>
            <h2>Your campaign has been sent!</h2>
            <p>Some messages may have failed to send. You can retry these by clicking on Retry. </p>
          </>
          )

      }

      <div className="separator"></div>

      {
        stats.status &&
        <ProgressDetails
          sentAt={sentAt}
          numRecipients={numRecipients}
          stats={stats}
          handlePause={handlePause}
          handleRetry={handleRetry}
        />
      }
    </>
  )
}

export default SMSDetail
