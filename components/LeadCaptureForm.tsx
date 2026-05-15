'use client';

import { useState, useRef, useId, ChangeEvent, FormEvent, cloneElement, isValidElement } from 'react';

type CompanySize = '1-50' | '51-200' | '201-500' | '501-1000' | '1000+';
type Department =
  | 'Engineering'
  | 'Finance'
  | 'HR'
  | 'Operations'
  | 'Sales'
  | 'Marketing'
  | 'Other';
type ProductInterest = 'C.A.R.B. Fleet' | 'PantryOS' | 'CrumbTrail Analytics';
type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  firstName: string;
  lastName: string;
  workEmail: string;
  companySize: CompanySize | '';
  department: Department | '';
  productInterests: ProductInterest[];
  financeAck: boolean;
  carbFloorAck: boolean;
}

type SalesPod = 'smb_pod' | 'enterprise_pod' | 'hardware_specialist_pod';

function computeSalesRoutingPods(state: FormState): SalesPod[] {
  const pods: SalesPod[] = [];
  const isEnterprise =
    state.companySize === '501-1000' ||
    state.companySize === '1000+' ||
    state.productInterests.includes('CrumbTrail Analytics');
  pods.push(isEnterprise ? 'enterprise_pod' : 'smb_pod');
  if (state.productInterests.includes('C.A.R.B. Fleet')) pods.push('hardware_specialist_pod');
  return pods;
}

function validateEmail(email: string): string {
  if (!email) return 'Work email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  return '';
}

const PRODUCT_OPTIONS: ProductInterest[] = ['C.A.R.B. Fleet', 'PantryOS', 'CrumbTrail Analytics'];
const COMPANY_SIZES: CompanySize[] = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
const DEPARTMENTS: Department[] = [
  'Engineering', 'Finance', 'HR', 'Operations', 'Sales', 'Marketing', 'Other',
];

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  workEmail: '',
  companySize: '',
  department: '',
  productInterests: [],
  financeAck: false,
  carbFloorAck: false,
};

interface LeadCaptureFormProps {
  onSuccess?: () => void;
}

export default function LeadCaptureForm({ onSuccess }: LeadCaptureFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const showFinanceAck = form.department === 'Finance';
  const showCarbFloorAck = form.productInterests.includes('C.A.R.B. Fleet');
  const isLoading = status === 'loading';

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleProductInterestChange(product: ProductInterest, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      productInterests: checked
        ? [...prev.productInterests, product]
        : prev.productInterests.filter((p) => p !== product),
    }));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(validateEmail(form.workEmail));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailErr = validateEmail(form.workEmail);
    if (emailErr) {
      setEmailTouched(true);
      setEmailError(emailErr);
      emailInputRef.current?.focus();
      return;
    }

    setStatus('loading');
    setSubmitError('');

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        work_email: form.workEmail,
        company_size: form.companySize,
        department: form.department,
        product_interests: form.productInterests,
        ...(showFinanceAck && { finance_ack: form.financeAck }),
        ...(showCarbFloorAck && { carb_floor_ack: form.carbFloorAck }),
        sales_routing_pods: computeSalesRoutingPods(form),
      };

      // Simulated API call — replace with real CRM POST
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      console.log(JSON.stringify(payload, null, 2));

      setStatus('success');
      onSuccess?.();
    } catch {
      setStatus('error');
      setSubmitError('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-white text-3xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-white">You&apos;re all set!</h3>
        <p className="text-white/70 max-w-sm mx-auto">
          Thanks for reaching out. Our team will be in touch within 1 business day.
        </p>
      </div>
    );
  }

  const isSubmitDisabled =
    isLoading ||
    !form.firstName ||
    !form.lastName ||
    !form.workEmail ||
    !form.companySize ||
    !form.department ||
    (showFinanceAck && !form.financeAck) ||
    (showCarbFloorAck && !form.carbFloorAck);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" required>
          <input
            type="text"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setField('firstName', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Last Name" required>
          <input
            type="text"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setField('lastName', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Work Email" required error={emailTouched ? emailError : ''} errorId="email-error">
        <input
          ref={emailInputRef}
          type="email"
          required
          autoComplete="email"
          value={form.workEmail}
          aria-invalid={emailTouched && !!emailError}
          aria-describedby={emailTouched && emailError ? 'email-error' : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setField('workEmail', e.target.value);
            if (emailTouched) setEmailError(validateEmail(e.target.value));
          }}
          onBlur={handleEmailBlur}
          className={`${inputCls} ${emailTouched && emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
        />
      </Field>

      <Field label="Company Size" required>
        <select
          required
          value={form.companySize}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setField('companySize', e.target.value as CompanySize)
          }
          className={inputCls}
        >
          <option value="" disabled>Select…</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Department" required>
        <select
          required
          value={form.department}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setField('department', e.target.value as Department)
          }
          className={inputCls}
        >
          <option value="" disabled>Select…</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-white/80 mb-2">Product Interest</legend>
        <div className="space-y-2">
          {PRODUCT_OPTIONS.map((product) => (
            <label key={product} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.productInterests.includes(product)}
                onChange={(e) => handleProductInterestChange(product, e.target.checked)}
                className="h-4 w-4 rounded border-white/50 text-white focus:ring-white bg-white/10"
              />
              <span className="text-sm text-white/80">{product}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showFinanceAck && (
        <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-white/10 border border-white/30 p-4">
          <input
            type="checkbox"
            required
            checked={form.financeAck}
            onChange={(e) => setField('financeAck', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/50 text-white focus:ring-white bg-white/10"
          />
          <span className="text-sm text-white/80">
            I acknowledge that SnackOverflow is not liable for audit errors caused by sugar
            rushes <span className="text-white">*</span>
          </span>
        </label>
      )}

      {showCarbFloorAck && (
        <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-white/10 border border-white/30 p-4">
          <input
            type="checkbox"
            required
            checked={form.carbFloorAck}
            onChange={(e) => setField('carbFloorAck', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/50 text-white focus:ring-white bg-white/10"
          />
          <span className="text-sm text-white/80">
            I confirm our office floors are entirely flat and wheelchair accessible{' '}
            <span className="text-white">*</span>
          </span>
        </label>
      )}

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-400 text-center">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        aria-busy={isLoading}
        className="w-full rounded-xl bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-navy shadow enabled:hover:bg-brand-mustard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <Spinner />
            Submitting…
          </>
        ) : (
          'Request Demo'
        )}
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const inputCls =
  'w-full rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm text-white shadow-sm placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30';

function Field({
  label,
  required,
  error,
  errorId,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}
        {required && <span className="ml-0.5 text-white"> *</span>}
      </label>
      {isValidElement(children) ? cloneElement(children as React.ReactElement<{ id: string }>, { id }) : children}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
