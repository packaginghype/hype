const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NAME_RE = /^[\p{L}]+(?:[ .'-][\p{L}]+)*$/u;
const POSITIVE_NUMBER_RE = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

export function validateContactName(value: string): string | null {
  const name = value.trim();
  if (!name) return "Name is required";
  if (/\d/.test(name)) return "Name cannot contain numbers";
  if (!NAME_RE.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  if (name.replace(/[ .'-]/g, "").length < 2) {
    return "Enter a valid name";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Email is required";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address";
  return null;
}

export function validatePhone(value: string): string | null {
  const phone = value.trim();
  if (!phone) return "Phone number is required";
  if (/[A-Za-z]/.test(phone)) return "Phone number must contain only digits";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "Phone number must contain only digits";
  if (digits.length < 7 || digits.length > 15) {
    return "Enter a valid phone number (7–15 digits)";
  }
  return null;
}

export function validateDimension(label: string, value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (!POSITIVE_NUMBER_RE.test(raw) || Number(raw) <= 0) {
    return `${label} must be a valid number`;
  }
  return null;
}

export function validateQuantity(value: string | number): string | null {
  if (value === "" || value === null || value === undefined) {
    return "Select a valid quantity";
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
    return "Quantity must be a valid number";
  }
  return null;
}
