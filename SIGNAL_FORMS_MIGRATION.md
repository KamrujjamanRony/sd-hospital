# Signal Forms Migration Guide

Angular 21 introduces a new **Signal Forms** API (`@angular/forms/signals`). This document captures the migration pattern that has been applied to a first batch of forms in this codebase and the steps to convert the remaining forms.

## What has been migrated

Already converted to Signal Forms (build verified):

- `src/app/pages/login/login.ts` + `login.html`
- `src/app/components/serial/shared/modal/add-department-modal/`
- `src/app/components/serial/shared/modal/edit-department-modal/`
- `src/app/components/serial/shared/modal/add-user-modal/`
- `src/app/components/serial/shared/modal/edit-user-modal/`
- `src/app/components/serial/shared/modal/appointment-modal-serial/`

Still to migrate (Reactive / template-driven forms remaining):

- `src/app/components/serial/shared/modal/add-doctor-modal/` (≈30 fields)
- `src/app/components/serial/shared/modal/edit-doctor-modal/` (≈30 fields)
- `src/app/components/main/shared/all-modals/appointment-modal/` (TS has a `FormBuilder` form but the template has **no form markup** — either delete the form definition or add a template)
- MIS add/edit pages under `src/app/pages/serial/MIS/`: about-us, contact-us, career, gallery, instrument, services, hospital-news, health-news, carousel (each has an add and an edit variant)
- `src/app/pages/serial/appointment-form/`
- `src/app/components/main/shared/all-modals/delete/` (auth code prompt)

## The Pattern

### 1. Component (TypeScript)

```ts
import { Component, signal } from "@angular/core";
import { form, required, minLength, pattern, email, validate, FormField } from "@angular/forms/signals";

interface MyModel {
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: "app-my",
  standalone: true,
  imports: [FormField], // ← needed in templates that use [formField]
  templateUrl: "./my.html",
})
export class MyComponent {
  isSubmitted = signal(false);

  // Source-of-truth signal holding the current values.
  model = signal<MyModel>({ name: "", email: "", phone: "" });

  // The form: validators are declared in the schema callback.
  myForm = form<MyModel>(this.model, (p) => {
    required(p.name, { message: "Name is required" });
    minLength(p.name, 2, { message: "Name must be at least 2 characters" });
    required(p.email, { message: "Email is required" });
    email(p.email, { message: "Enter a valid email address" });
    pattern(p.phone, /^[0-9]{11,14}$/, { message: "Phone must be 11–14 digits" });

    // Custom validator example
    validate(p.name, (ctx) => {
      const v = ctx.value();
      if (v && v.toLowerCase() === "admin") {
        return { kind: "reserved", message: '"admin" is reserved' };
      }
      return null;
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitted.set(true);
    if (!this.myForm().valid()) return;

    const value = this.myForm().value(); // typed snapshot
    // ...submit to API
  }
}
```

### 2. Template (HTML)

```html
<form (submit)="onSubmit($event)" novalidate>
  @let nameField = myForm.name(); @let emailField = myForm.email();

  <label>
    Name
    <input [formField]="myForm.name" [class.border-rose-500]="!nameField.valid() && (nameField.touched() || isSubmitted())" />
    @if ((nameField.touched() || isSubmitted()) && !nameField.valid()) { @for (err of nameField.errors(); track err.kind) {
    <p class="text-rose-600 text-xs">{{ err.message || err.kind }}</p>
    } }
  </label>

  <button type="submit" [disabled]="isSubmitted() && !myForm().valid()">Save</button>
</form>
```

## Key Differences vs `ReactiveFormsModule`

| Before                              | After                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `FormBuilder.group({...})`          | `form(signal({...}), (p) => { ... validators ... })`                   |
| `formControlName="name"`            | `[formField]="myForm.name"`                                            |
| `[formGroup]="myForm"` on `<form>`  | nothing on `<form>` (just `(submit)` and `novalidate`)                 |
| `myForm.invalid`                    | `!myForm().valid()`                                                    |
| `myForm.get('name')?.touched`       | `myForm.name().touched()`                                              |
| `myForm.get('name')?.hasError('x')` | inspect `myForm.name().errors()` (array of `{kind, message}`)          |
| `myForm.value`                      | `myForm().value()` (typed)                                             |
| `myForm.patchValue({...})`          | `this.model.update(m => ({ ...m, ... }))` _or_ `this.model.set({...})` |
| `imports: [ReactiveFormsModule]`    | `imports: [FormField]`                                                 |

## Gotchas Discovered During the Migration

1. **`maxlength` HTML attribute is rejected on `[formField]` inputs.** Use a `pattern()` validator instead (or drop the attribute and let the validator handle length limits).
2. **`@let` aliases that are declared but never used cause `NG8112` warnings** — only declare aliases you actually reference.
3. **Multi-select `<select multiple>` cannot be bound via `[formField]`** directly (it targets single values). Handle manually with a `(change)` listener that updates the model signal, and validate via `validate(p.role, ctx => ...)`.
4. **Disabling a field via schema** (`disabled(p.username, () => true)`) does not put `disabled` on the native element — keep the HTML `disabled` attribute as well when you need the UI state.
5. **Replacing `patchValue` on selection change**: use `this.model.update(m => ({ ...m, fee: doctor.fee ?? 0 }))`. Always coerce nullables to satisfy the model type.
6. The `FormRoot` directive (`<form [formRoot]="myForm">`) intercepts submit and only triggers validation — it does not run business logic. Stick with `(submit)="onSubmit($event)" novalidate` for forms that need a custom handler.
7. **Initialising a form with async / Input data**: declare an `effect()` in the constructor that calls `model.set(...)` when the source signal (e.g. `selectedDoctor()`) emits.

## Recipe for the remaining forms

For each component that still uses `FormBuilder` / `ReactiveFormsModule` / `[(ngModel)]`:

1. Delete the imports `FormBuilder`, `FormGroup`, `FormControl`, `Validators`, `ReactiveFormsModule`, `FormsModule`.
2. Add `import { form, required, minLength, pattern, email, validate, FormField } from '@angular/forms/signals';`
3. Add `FormField` to the component's `imports` array.
4. Define an `interface` for the form value shape.
5. Create `model = signal<MyModel>({ ...defaults })`.
6. Replace `this.fb.group({...})` with `myForm = form<MyModel>(this.model, p => { ... });`
7. In the template:
   - On `<form>`: replace `[formGroup]` with `novalidate` and use `(submit)="onSubmit($event)"`.
   - On every input/textarea/select: replace `formControlName="x"` with `[formField]="myForm.x"`. Remove `[(ngModel)]` and `name="..."`.
   - Replace the `*ngIf` / `@if` error blocks with the `@let x = myForm.x();` + `@if ((x.touched() || isSubmitted()) && !x.valid()) { @for (err of x.errors(); …) }` pattern shown above.
   - Drop `maxlength` / `minlength` HTML attributes — encode the rule in the schema instead.
8. Replace `patchValue` calls with `this.model.update(...)` (or wrap in an `effect()` if data comes from an async signal/computed).
9. In `onSubmit`: set `isSubmitted`, guard with `!myForm().valid()`, read `myForm().value()`.
10. Run `npm run build` after each component (or batch of components) to catch errors quickly.

## Suggested validation upgrades

Where the original forms only used `Validators.required`, consider stricter rules:

| Field shape             | Validators to add                                   |
| ----------------------- | --------------------------------------------------- |
| name, username          | `required` + `minLength(2 or 3)`                    |
| password                | `required` + `minLength(4)` (or higher)             |
| email                   | `required` + `email()`                              |
| phone / mobile          | `required` + `pattern(/^[0-9]{11,14}$/)`            |
| numeric (fee, limit)    | `min(0)`                                            |
| URL                     | `pattern(/^https?:\/\/.+/)`                         |
| description, additional | optional `maxLength(2000)` to prevent huge payloads |

## Build verification

```powershell
npm run build
```

A clean migration should produce only the two pre-existing warnings (initial-bundle budget exceeded by ~100 kB and the two empty-CSS-selector warnings). Anything else (NG8022, NG8112, TS2322, etc.) is a real error to fix.
