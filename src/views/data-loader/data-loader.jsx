import { useEffect } from 'react'

import Spinner from '../shared/spinner/spinner.view'
import useDataLoaderStyles from './data-loader.styles'

function DataLoader ({ tokenInfo, onFinishLoading }) {
  const classes = useDataLoaderStyles()

  useEffect(() => {
    if (tokenInfo) {
      onFinishLoading()
    }
  }, [tokenInfo, onFinishLoading])

  return (
    <div className={classes.dataLoader}>
      <Spinner />
    </div>
  )
}

export default DataLoader
