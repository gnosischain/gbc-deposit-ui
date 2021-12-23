import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import plusCircleIcon from '../../../images/plus-circle.svg'
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
          const fileData = JSON.parse(event.target.result);
          onDrop({ data: fileData, filename: jsonFiles[0].name });
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
        <span>Upload deposit data file <b>deposit_data.json</b></span>
        <img alt="" className={classes.plusIcon} src={plusCircleIcon} />
        <span>Drag file to upload or browse</span>
    </div>
  )
}

export default Dropzone
