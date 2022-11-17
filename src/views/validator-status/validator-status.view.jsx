import { useState, useCallback } from 'react'

import Dropzone from '../shared/dropzone/dropzone.view'
import Header from '../shared/header/header.view'
import { ReactComponent as LinkIcon } from '../../images/link-icon.svg'
import replaceIcon from '../../images/replace-icon.svg'
import useStyles from './validator-status.styles'
import { NETWORKS } from '../../constants';

const network = NETWORKS[process.env.REACT_APP_NETWORK_ID]

const ReplaceIcon = () =>
  <img style={{ width: 16, height: 16, margin: '0 8px -1px 0' }} src={replaceIcon} alt='' />


async function getStatuses(pubkeys) {
  const chunks = []
  for (let i = 0; i < pubkeys.length; i += 100) {
    chunks.push(pubkeys.slice(i, i + 100))
  }
  const data = await Promise.all(chunks.map(chunk => fetch(
    `${network.beaconExplorerUrl}/api/v1/validator/${chunk.join(',')}`
  ).then(r => r.json())))
  let statuses = []
  data.forEach(d => {
    if(d.data) statuses = statuses.concat(d.data)
  })
  return statuses
}

function ValidatorStatus ({ tokenInfo, depositData, onGoNext }) {
  const classes = useStyles()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statuses, setStatuses] = useState(null)
  const [emptyStatus, setEmptyStatus] = useState(null)
  const onDrop = useCallback(async files => {
    try {
      setLoading(true)
      let pubkeys = []
      try {
        files.forEach(file => {
          const newPubkeys = JSON.parse(file.data).map(d => ({ pubkey: d.pubkey, fileName: file.name }))
          pubkeys = pubkeys.concat(newPubkeys)
        })
      } catch (error) {
        throw new Error('Oops, something went wrong while parsing your json files. Please check the files and try again.')
      }

      let statuses = await getStatuses(pubkeys.map(item => item.pubkey));

      if(statuses.length === 0){
        setEmptyStatus(pubkeys)
      }else{
        statuses = statuses.map(status => {
          const index = pubkeys.findIndex(item => `0x${item.pubkey}` === status.pubkey)
          return {
            ...status,
            fileName: pubkeys[index].fileName
          }
        })
        const depositedInvalidStatuses = statuses.filter(item => ['deposited', 'deposited_invalid'].includes(item.status))
        const depositedValidStatuses = statuses.filter(item => ['deposited_valid'].includes(item.status))
        const pendingStatuses = statuses.filter(item => ['pending'].includes(item.status))
        const activeOnlineStatuses = statuses.filter(item => ['active_online'].includes(item.status))
        const activeOfflineStatuses = statuses.filter(item => ['active_offline'].includes(item.status))
        const slashingStatuses = statuses.filter(item => ['slashing_online', 'slashing_offline'].includes(item.status))
        const slashedStatuses = statuses.filter(item => ['slashed'].includes(item.status))
        const exitingStatuses = statuses.filter(item => ['exiting_online', 'exiting_offline'].includes(item.status))
        const exitedStatuses = statuses.filter(item => ['exited'].includes(item.status))
  
        const statusesMap = {
          depositedInvalid: {
            display: 'Deposited Invalid',
            name: 'deposited_invalid',
            color: 'orange',
            data: depositedInvalidStatuses,
          },
          depositedValid: {
            display: 'Deposited Valid',
            name: 'deposited_valid',
            color: 'blue',
            data: depositedValidStatuses,
          },
          pending: {
            display: 'Pending',
            name: 'pending',
            color: 'blue',
            data: pendingStatuses,
          },
          activeOnline: {
            display: 'Active Online',
            name: 'active_online',
            color: 'green',
            data: activeOnlineStatuses,
          },
          activeOffline: {
            display: 'Active Offline',
            name: 'active_offline',
            color: 'orange',
            data: activeOfflineStatuses,
          },
          slashing: {
            display: 'Slashing',
            name: 'slashing',
            color: 'red',
            data: slashingStatuses,
          },
          slashed: {
            display: 'Slashed',
            name: 'slashed',
            color: 'red',
            data: slashedStatuses,
          },
          exiting: {
            display: 'Exiting',
            name: 'exiting',
            color: 'orange',
            data: exitingStatuses,
          },
          exited: {
            display: 'Exited',
            name: 'exited',
            color: 'orange',
            data: exitedStatuses,
          },
        }
        setStatuses(statusesMap)
      }
    } catch (error) {
      setError(error)
    }finally{
      setLoading(false)
    }
  }, [])

  const onReplace = useCallback(() => {
    setStatuses(null)
    setError(null)
  }, [])

  const downloadCSV = useCallback((status) => {
    const rows = status.data.map(item => [item.pubkey, item.status, item.fileName])
    let csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${status.name}-${+new Date()}.csv`)
    document.body.appendChild(link)
    link.click()
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
            {error.toString()}
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
  } else if (emptyStatus) {
    component = (
      <div className={classes.dataContainer}>
        <b>Validator status not found</b>
          <span className={classes.textItem}>
            Your validators may be initialising. Check them in the Beacon Chain Explorer:
          </span>
          <div className={classes.buttonGroup}>
          <div className={classes.txsContainer}>
            {emptyStatus.map((pubkey, index) => (
              <div><a
                className={classes.button}
                href={`${network.beaconExplorerUrl}/validator/${pubkey.pubkey}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {index + 1}. {pubkey.pubkey.slice(0, 40)}...
                <LinkIcon className={classes.buttonIcon} />
              </a></div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (statuses) {
    var filteredStatus = Object.values(statuses).filter(status =>status.data.length > 0);
    var validatorIds = filteredStatus.map(status => status.data.map(val => val.validatorindex));

    if(filteredStatus.length === 0){
      component = (
        <>
          <div className={classes.dataContainer}>
            <b>{depositData.filename}</b>
          </div>
        </>
      )
    }else{
      component = (
        <>
          <div className={classes.dataContainer}>
            <b>{depositData.filename}</b>
            <button className={classes.replaceButton} onClick={onReplace}>
              <ReplaceIcon />Replace
            </button>
            <div className={classes.statusesContainer}>
              {filteredStatus.map(status =>
                status.data.length > 0 ? (
                  <div className={classes.statusItem} onClick={() => downloadCSV(status)}>
                    <div className={classes[`dot-${status.color}`]} />
                    <span><b>{status.data.length}</b> {status.display}</span>
                  </div>
                ) : null
              )}
            </div>
            <div className={classes.txsContainer}>
              {filteredStatus.map(status => {
                if (!status.data.length) return null
                return (
                  <div className={classes.listItemsContainer}>
                    {status.data.map((validator, index) => (
                      <div className={classes.listItem}>
                        <span className={classes.listItemIndex}>{index + 1}.</span>{' '}
                        <a
                          className={classes.button}
                          href={`${network.beaconExplorerUrl}/validator/${validator.pubkey}`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {validator.pubkey.slice(0, 26)}...
                        </a>
                        <div className={classes.status}>
                          <div className={classes[`dot-${status.color}`]} /> {status.display}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
            <br></br>
            <p>
            <a
              className={classes.button}
              href={`${network.beaconExplorerUrl}/dashboard?validators=${validatorIds}`}
              target='_blank'
              rel='noopener noreferrer'
            >Import all validators into the Beacon Chain Explorer Dashboard</a></p>
          </div>
        </>
      )
    }
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
