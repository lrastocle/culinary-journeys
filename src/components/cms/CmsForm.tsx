import { useState, type FormEvent } from "react";

import { submitForm } from "@/lib/cms/api";
import type { Form, FormField } from "@/lib/cms/types";
import { useLang } from "@/lib/i18n";

import { RichText } from "./RichText";

const inputCls =
  "w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-hibiscus";

/**
 * Formulaire construit dans l'admin (plugin Form Builder). Les messages arrivent dans
 * « Messages reçus » de l'admin. `prefill` préremplit le sujet (ex. depuis le bouton
 * « Demander » d'une expérience) : l'option du même nom, sinon la première ligne du message.
 */
export function CmsForm({ form, prefill }: { form: Form; prefill?: string | undefined }) {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const fields = (form.fields || []).filter((f) => f.name || f.blockType === "message");
  const select = fields.find((f) => f.blockType === "select");
  const matching = prefill
    ? select?.options?.find((o) => o.label.toLowerCase() === prefill.toLowerCase() || o.value === prefill)
    : undefined;

  const defaultValue = (field: FormField) => {
    if (field === select && matching) return matching.value;
    if (field.blockType === "textarea" && prefill && !matching) return `${prefill}\n\n`;
    return typeof field.defaultValue === "string" ? field.defaultValue : undefined;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    for (const field of fields) {
      if (!field.name) continue;
      values[field.name] = field.blockType === "checkbox" ? (data.get(field.name) ? "oui" : "non") : String(data.get(field.name) ?? "");
    }
    setStatus("sending");
    try {
      await submitForm({ data: { formId: form.id, values, website: String(data.get("website") ?? "") } });
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border-2 border-ink bg-leaf p-6 font-display text-lg font-extrabold text-cream">
        {form.confirmationMessage?.root?.children?.length ? (
          <RichText value={form.confirmationMessage} className="!text-cream" />
        ) : (
          t.contact.sent
        )}
      </div>
    );
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit} noValidate={false}>
      {fields.map((field, i) => {
        const id = `form-${form.id}-${field.name || i}`;
        const span = field.width && field.width <= 50 ? "col-span-2 sm:col-span-1" : "col-span-2";
        const label = (
          <label htmlFor={id} className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-ink/70">
            {field.label || field.name}
            {field.required && <span className="text-hibiscus"> *</span>}
          </label>
        );
        const common = { id, name: field.name, required: Boolean(field.required), defaultValue: defaultValue(field), className: inputCls };
        switch (field.blockType) {
          case "message":
            return (
              <div key={i} className="col-span-2">
                <RichText value={field.message} />
              </div>
            );
          case "textarea":
            return (
              <div key={i} className={span}>
                {label}
                <textarea rows={5} {...common} />
              </div>
            );
          case "select":
            return (
              <div key={i} className={span}>
                {label}
                <select {...common} defaultValue={defaultValue(field) ?? ""}>
                  <option value="" disabled>
                    —
                  </option>
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          case "checkbox":
            return (
              <div key={i} className="col-span-2 flex items-center gap-3">
                <input type="checkbox" id={id} name={field.name} required={Boolean(field.required)} defaultChecked={field.defaultValue === true} className="size-5 accent-hibiscus" />
                <label htmlFor={id} className="text-sm font-medium">
                  {field.label}
                </label>
              </div>
            );
          default:
            return (
              <div key={i} className={span}>
                {label}
                <input type={field.blockType === "email" ? "email" : field.blockType === "number" ? "number" : "text"} {...common} />
              </div>
            );
        }
      })}
      {/* Piège à robots : invisible pour les visiteurs. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`form-${form.id}-website`}>Website</label>
        <input id={`form-${form.id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" && (
        <p role="alert" className="col-span-2 rounded-xl border-2 border-ink bg-hibiscus px-4 py-3 text-sm font-semibold text-cream">
          {t.contact.error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-pop col-span-2 w-fit rounded-full bg-hibiscus px-8 py-4 font-display text-base font-extrabold text-cream disabled:opacity-60"
      >
        {status === "sending" ? t.contact.sending : form.submitButtonLabel || t.contact.send}
      </button>
    </form>
  );
}
