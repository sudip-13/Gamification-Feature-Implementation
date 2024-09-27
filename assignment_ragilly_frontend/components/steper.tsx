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


const stepswithdraw = [
  'Payment initiated',
  'Withdrawn within 12 hrs',
  'Successfully updated',
];



interface HorizontalLinearAlternativeLabelStepperProps {
  account: number;
  transactionId: string;
}


export default function HorizontalLinearAlternativeLabelStepper() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper  activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel className=''>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}


export const HorizontalLinearAlternativeLabelStepperwithdraw: React.FC<HorizontalLinearAlternativeLabelStepperProps> = ({ account, transactionId }) => {
  const [activeStep] = React.useState(1); 

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepswithdraw.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <p>Payment completed for account: {account}</p>
      <p>Transaction ID: {transactionId}</p>
    </Box>
  );
};