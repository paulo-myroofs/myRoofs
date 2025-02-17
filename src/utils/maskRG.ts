export function MaskRg(value: string): string {
  const v = value.toUpperCase().replace(/[^\dA-Z]/g, "");

  if (/^[A-Z]\d{7,9}$/.test(v)) {
    return v.replace(/^([A-Z])(\d{2})(\d{3})(\d{3})(\d?)$/, "$1-$2.$3.$4-$5");
  }

  if (v.length === 7) {
    return v.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
  }
  if (v.length === 8) {
    return v.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
  }
  if (v.length === 9) {
    return v.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
  }
  if (v.length === 10) {
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  return value;
}
