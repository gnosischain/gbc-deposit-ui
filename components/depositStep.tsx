import Image from 'next/image';
import ToolTip from './tooltip';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

interface DepositStepProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}

export function DepositStep({ getRootProps, getInputProps }: DepositStepProps) {
  return (
    <div
      className='w-full h-full flex flex-col items-center justify-center hover:cursor-pointer'
      {...getRootProps()}
    >
      <input id='dropzone' {...getInputProps()} />
      Upload deposit date file
      <div className='flex font-bold items-center gap-x-1'>
        deposit_data.json{' '}
        <ToolTip
          text={
            <p>
              See{' '}
              <a
                href='https://docs.gnosischain.com/node/manual/validator/generate-keys/'
                className='underline'
              >
                here
              </a>{' '}
              to learn how to generate the file.
            </p>
          }
        />
      </div>
      <Image
        src='/drop.svg'
        alt='Drop'
        width={80}
        height={24}
        className='my-8 rounded-full shadow-lg'
      />
      <div>Drag file to upload or browse</div>
    </div>
  );
}
