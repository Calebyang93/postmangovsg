import React, { useState } from 'react'
import { cloneDeep } from 'lodash'

import { SMSCampaign, SMSProgress, Status } from 'classes'
import { ProgressPane } from 'components/common'
import SMSTemplate from './SMSTemplate'
import SMSRecipients from './SMSRecipients'
import SMSCredentials from './SMSCredentials'
import SMSSend from './SMSSend'
import SMSDetail from './SMSDetail'

import styles from '../Create.module.scss'

const SMS_PROGRESS_STEPS = [
  'Create Template',
  'Upload Recipients',
  'Insert Credentials',
  'Send',
]

const CreateSMS = ({ campaign: initialCampaign }: { campaign: SMSCampaign }) => {
  const [activeStep, setActiveStep] = useState(initialCampaign.progress)
  const [campaign, setCampaign] = useState(initialCampaign)

  // Modifies campaign object in state and navigates to next step
  const onNext = (changes: any, next = true) => {
    const updatedCampaign = Object.assign(cloneDeep(campaign), changes) as SMSCampaign
    updatedCampaign.setProgress()
    setCampaign(updatedCampaign)
    if (next) {
      setActiveStep(activeStep + 1)
    }
  }

  function renderStep() {
    switch (activeStep) {
      case SMSProgress.CreateTemplate:
        return (
          <SMSTemplate body={campaign.body} onNext={onNext} />
        )
      case SMSProgress.UploadRecipients:
        return (
          <SMSRecipients params={campaign.params} csvFilename={campaign.csvFilename} numRecipients={campaign.numRecipients} onNext={onNext} />
        )
      case SMSProgress.InsertCredentials:
        return (
          <SMSCredentials hasCredential={campaign.hasCredential} onNext={onNext} />
        )
      case SMSProgress.Send:
        return (
          <SMSSend numRecipients={campaign.numRecipients} onNext={onNext} />
        )
      default:
        return (<p>Invalid step</p>)
    }
  }

  return (
    <div className={styles.createContainer}>
      {
        campaign.status !== Status.Draft
          ? (
            <div className={styles.stepContainer}>
              <SMSDetail id={campaign.id} sentAt={campaign.sentAt} numRecipients={campaign.numRecipients}></SMSDetail>
            </div>
          )
          : (
            <>
              <ProgressPane steps={SMS_PROGRESS_STEPS} activeStep={activeStep} setActiveStep={setActiveStep} progress={campaign.progress} />
              <div className={styles.stepContainer}>
                {renderStep()}
              </div>
            </>
          )
      }
    </div>
  )
}

export default CreateSMS
