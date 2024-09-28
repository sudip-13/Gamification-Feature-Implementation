import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  '1st Payment',
  '2nd Payment',
  '3rd Payment',
  '4th Payment',
  '5th Payment',
];

interface Props{
  noOfTransactions:number
}


const HorizontalLinearAlternativeLabelStepper:React.FC<Props> = ({noOfTransactions})=> {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper  activeStep={noOfTransactions} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel className=''>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default HorizontalLinearAlternativeLabelStepper;