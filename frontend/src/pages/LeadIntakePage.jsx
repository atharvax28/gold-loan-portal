import { useEffect, useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import CustomerGoldForm from '../components/CustomerGoldForm';
import SchemeSelector from '../components/SchemeSelector';
import ConfirmationView from '../components/ConfirmationView';
import { getLoanSchemes } from '../api/client';

const EMPTY_FORM = {
  customerName: '',
  mobileNumber: '',
  grossWeightGrams: '',
  netWeightGrams: '',
  purityKarat: 22,
  selectedPlanId: '',
};

export default function LeadIntakePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesError, setSchemesError] = useState(null);

  useEffect(() => {
    getLoanSchemes()
      .then((data) => setSchemes(data.schemes))
      .catch((err) => setSchemesError(err.message))
      .finally(() => setSchemesLoading(false));
  }, []);

  function handleStartOver() {
    setForm(EMPTY_FORM);
    setSubmittedLead(null);
    setStep(1);
  }

  return (
    <div className="intake-page">
      <StepIndicator currentStep={step} />

      {step === 1 && <CustomerGoldForm form={form} onChange={setForm} onNext={() => setStep(2)} />}

      {step === 2 && (
        <SchemeSelector
          form={form}
          onChange={setForm}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          schemes={schemes}
          loading={schemesLoading}
          error={schemesError}
        />
      )}

      {step === 3 && (
        <>
          <ConfirmationView
            form={form}
            schemes={schemes}
            onBack={() => setStep(2)}
            onSubmitted={setSubmittedLead}
            submittedLead={submittedLead}
          />
          {submittedLead && (
            <button type="button" className="btn btn-secondary btn-center" onClick={handleStartOver}>
              Submit Another Application
            </button>
          )}
        </>
      )}
    </div>
  );
}
