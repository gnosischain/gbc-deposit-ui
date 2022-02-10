import { useState, useCallback } from 'react'

import Dropzone from '../shared/dropzone/dropzone.view'
import Header from '../shared/header/header.view'
import replaceIcon from '../../images/replace-icon.svg'
import useStyles from './validator-status.styles'


const ReplaceIcon = () =>
  <img style={{ width: 16, height: 16, margin: '0 8px -1px 0' }} src={replaceIcon} alt='' />


async function getStatuses(pubkeys) {
  const chunks = []
  for (let i = 0; i < pubkeys.length; i += 100) {
    chunks.push(pubkeys.slice(i, i + 100))
  }
  const data = await Promise.all(chunks.map(chunk => fetch(
    `https://beacon.gnosischain.com/api/v1/validator/${chunk.join(',')}`
  ).then(r => r.json())))
  let statuses = []
  data.forEach(d => {
    statuses = statuses.concat(d.data)
  })
  return statuses
}

function ValidatorStatus ({ tokenInfo, depositData, onGoNext }) {
  const classes = useStyles()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statuses, setStatuses] = useState(null)
  const onDrop = useCallback(async data => {
    setLoading(true)
    let pubkeys
    try {
      pubkeys = [...new Set(data.map(d => JSON.parse(d)).flat(1).map(d => d.pubkey))]
    } catch (error) {
      setError('Oops, something went wrong while parsing your json files. Please check the files and try again.')
      setLoading(false)
      return
    }
    const statuses = await getStatuses(pubkeys)
    const activeOnline = statuses.filter(item => item.status === 'active_online')
    const activeOffline = statuses.filter(item => item.status === 'active_offline')
    const slashed = statuses.filter(item => item.status === 'slashed')
    setStatuses({ activeOnline, activeOffline, slashed })
    setLoading(false)
  }, [])
  const onReplace = useCallback(() => {
    setStatuses(null)
    setError(null)
  }, [])

  let component
  if (error) {
    component = (
      <div className={classes.dataContainer}>
        <b>{depositData.filename}</b>
        <button className={classes.replaceButton} onClick={onReplace}>
          <ReplaceIcon />Replace
        </button>
        <div className={classes.textItemsContainer}>
          <span className={classes.textItem}>
            {error}
          </span>
        </div>
      </div>
    );
  } else if (loading) {
    component = (
      <div className={classes.dataContainer}>
        <b>deposit_data.json</b>
        <div className={classes.textItemsContainer}>
          <span className={classes.textItem}>
            Checking...
          </span>
        </div>
      </div>
    );
  } else if (statuses) {
    component = (
      <>
        <div className={classes.dataContainer}>
          <b>{depositData.filename}</b>
          <button className={classes.replaceButton} onClick={onReplace}>
            <ReplaceIcon />Replace
          </button>
          <div className={classes.textItemsContainer}>
            <div className={classes.textItem}>
              <div className={classes.dotGreen} />
              <span><b>{statuses.activeOnline.length}</b> Active Online</span>
            </div>
            <div className={classes.textItem}>
              <div className={classes.dotOrange} />
              <span><b>{statuses.activeOffline.length}</b> Active Offline</span>
            </div>
            <div className={classes.textItem}>
              <div className={classes.dotRed} />
              <span><b>{statuses.slashed.length}</b> Slashed</span>
            </div>
          </div>
          <div className={classes.txsContainer}>
            {statuses.activeOffline.concat(statuses.slashed).map((validator, index) => (
              <div className={classes.listItem}>
                <span className={classes.listItemIndex}>{index + 1}.</span>{' '}
                <a
                  className={classes.button}
                  href={`https://beacon.gnosischain.com/validator/${validator.pubkey}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {validator.pubkey.slice(0, 36)}...
                </a>
                {validator.status === 'active_offline' &&
                  <div className={classes.status}>
                    <div className={classes.dotOrange} /> offline
                  </div>
                }
                {validator.status === 'slashed' &&
                  <div className={classes.status}>
                    <div className={classes.dotRed} /> slashed
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </>
    )
  } else {
    component = <Dropzone
      onDrop={onDrop}
      isMultiple={true} />
  }
  return (
    <div className={classes.container}>
      <Header
        title='Check GBC validators statuses'
        tokenInfo={tokenInfo}
      />
      {component}
    </div>
  )
}

export default ValidatorStatus
