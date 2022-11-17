import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactTooltip from 'react-tooltip'

import plusCircleIcon from '../../../images/plus-circle.svg'
import infoIcon from '../../../images/info-icon.svg'
import useStyles from './dropzone.styles'

function Dropzone({ onDrop, dappNode, isMultiple }) {
  const classes = useStyles()

  const onFileDrop = useCallback(async (jsonFiles, rejectedFiles) => {
    if (rejectedFiles?.length) {
      console.log('This is not a valid file. Please try again.');
      return;
    }

    if (isMultiple) {
      const data = await Promise.all(jsonFiles.map(file =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = async event => {
            if (event.target) {
              resolve({
                name: file.name,
                data: event.target.result,
              });
            }
          };
          reader.readAsText(file);
        })
      ));
      onDrop(data);
    } else if (jsonFiles.length === 1) {
      const reader = new FileReader();
      reader.onload = async event => {
        if (event.target) {
          onDrop({ fileData: event.target.result, filename: jsonFiles[0].name });
        }
      };
      reader.readAsText(jsonFiles[0]);
    }
  }, [onDrop, isMultiple]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onFileDrop, accept: 'application/json' })
  return (
    <div
      className={classes.dropzone}
      {...getRootProps()}
    >
        <input {...getInputProps()} />
        {!dappNode ?
          <span>
            Upload deposit data file{isMultiple && 's'} <b>deposit_data.json</b>{' '}
            <a
              href="https://docs.gnosischain.com/node/validator-deposits"
              target='_blank'
              rel='noopener noreferrer'
              data-tip="How to generate deposit_data.json?"
              onClick={e => { e.stopPropagation() }}
            >
              <img alt="" className={classes.infoIcon} src={infoIcon} />
            </a>
            <ReactTooltip effect="solid" />
          </span>
          :
          <span>
            Upload deposit data file for <b>4 validators exactly</b>{' '}
            <a
              href="https://docs.gnosischain.com/install/with-dappnode"
              target='_blank'
              rel='noopener noreferrer'
              data-tip="How to generate deposit_data.json?"
              onClick={e => { e.stopPropagation() }}
            >
              <img alt="" className={classes.infoIcon} src={infoIcon} />
            </a>
            <ReactTooltip effect="solid" />
          </span>
        }
        <img alt="" className={classes.plusIcon} src={plusCircleIcon} />
        <span>Drag file{isMultiple && 's'} to upload or browse</span>
    </div>
  )
}

export default Dropzone
