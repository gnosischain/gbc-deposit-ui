import { useEffect } from 'react'

import Spinner from '../shared/spinner/spinner.view'
import useDataLoaderStyles from './data-loader.styles'

function DataLoader ({ fromTokenInfo, toTokenInfo, onFinishLoading }) {
  const classes = useDataLoaderStyles()

  useEffect(() => {
    if (fromTokenInfo && toTokenInfo) {
      onFinishLoading()
    }
  }, [fromTokenInfo, toTokenInfo, onFinishLoading])

  return (
    <div className={classes.dataLoader}>
      <Spinner />
    </div>
  )
}

export default DataLoader
