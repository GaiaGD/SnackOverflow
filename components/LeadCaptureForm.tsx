'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

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

  if (state.productInterests.includes('C.A.R.B. Fleet')) {
    pods.push('hardware_specialist_pod');
  }

  return pods;
}

const PRODUCT_OPTIONS: ProductInterest[] = ['C.A.R.B. Fleet', 'PantryOS', 'CrumbTrail Analytics'];
const COMPANY_SIZES: CompanySize[] = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
const DEPARTMENTS: Department[] = [
  'Engineering',
  'Finance',
  'HR',
  'Operations',
  'Sales',
  'Marketing',
  'Other',
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
  const [submitted, setSubmitted] = useState(false);

  const showFinanceAck = form.department === 'Finance';
  const showCarbFloorAck = form.productInterests.includes('C.A.R.B. Fleet');

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    console.log(JSON.stringify(payload, null, 2));
    setSubmitted(true);
    onSuccess?.();
  }

  if (submitted) {
    return (
      <p className="text-center text-zinc-700 py-8">
        Thanks! We&apos;ll be in touch shortly.
      </p>
    );
  }

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

      <Field label="Work Email" required>
        <input
          type="email"
          required
          autoComplete="work email"
          value={form.workEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setField('workEmail', e.target.value)}
          className={inputCls}
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
        <legend className="text-sm font-medium text-zinc-700 mb-2">Product Interest</legend>
        <div className="space-y-2">
          {PRODUCT_OPTIONS.map((product) => (
            <label key={product} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.productInterests.includes(product)}
                onChange={(e) => handleProductInterestChange(product, e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-zinc-700">{product}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showFinanceAck && (
        <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-amber-50 border border-amber-200 p-4">
          <input
            type="checkbox"
            required
            checked={form.financeAck}
            onChange={(e) => setField('financeAck', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-zinc-700">
            I acknowledge that SnackOverflow is not liable for audit errors caused by sugar
            rushes <span className="text-red-500">*</span>
          </span>
        </label>
      )}

      {showCarbFloorAck && (
        <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-blue-50 border border-blue-200 p-4">
          <input
            type="checkbox"
            required
            checked={form.carbFloorAck}
            onChange={(e) => setField('carbFloorAck', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-zinc-700">
            I confirm our office floors are entirely flat and wheelchair accessible{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-colors"
      >
        Request Demo
      </button>
    </form>
  );
}

const inputCls =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
