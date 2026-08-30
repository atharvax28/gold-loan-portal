const STEPS = [
  { step: 1, label: 'Customer & Gold Details' },
  { step: 2, label: 'Loan Calculator & Scheme' },
  { step: 3, label: 'Submit & Confirmation' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <ol className="step-indicator">
      {STEPS.map(({ step, label }) => {
        const state = step === currentStep ? 'active' : step < currentStep ? 'done' : 'upcoming';
        return (
          <li key={step} className={`step-indicator__item step-indicator__item--${state}`}>
            <span className="step-indicator__bubble">{step < currentStep ? '✓' : step}</span>
            <span className="step-indicator__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
