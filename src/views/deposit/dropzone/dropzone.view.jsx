import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactTooltip from 'react-tooltip'

import plusCircleIcon from '../../../images/plus-circle.svg'
import infoIcon from '../../../images/info-icon.svg'
import useStyles from './dropzone.styles'

function Dropzone({ onDrop }) {
  const classes = useStyles()

  const onFileDrop = useCallback((jsonFiles, rejectedFiles) => {
    if (rejectedFiles?.length) {
      console.log('This is not a valid file. Please try again.');
      return;
    }

    // check if the file is JSON
    if (jsonFiles.length === 1) {
      const reader = new FileReader();
      reader.onload = async event => {
        if (event.target) {
          onDrop({ fileData: event.target.result, filename: jsonFiles[0].name });
        }
      };
      reader.readAsText(jsonFiles[0]);
    }
  }, [onDrop]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onFileDrop, accept: 'application/json' })
  return (
    <div
      className={classes.dropzone}
      {...getRootProps()}
    >
        <input {...getInputProps()} />
        <span>
          Upload deposit data file <b>deposit_data.json</b>{' '}
          <a
            href="https://docs.gnosischain.com/validator-info/validator-deposits#2-deposit-mgno"
            target='_blank'
            rel='noopener noreferrer'
            data-tip="How to generate deposit_data.json?"
            onClick={e => { e.stopPropagation() }}
          >
            <img alt="" className={classes.infoIcon} src={infoIcon} />
          </a>
          <ReactTooltip effect="solid" />
        </span>
        <img alt="" className={classes.plusIcon} src={plusCircleIcon} />
        <span>Drag file to upload or browse</span>
    </div>
  )
}

export default Dropzone
