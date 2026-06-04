import { Fraction } from '../types/inheritance';

// EBOB (En Büyük Ortak Bölen)
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// EKOK (En Küçük Ortak Kat)
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// Birden fazla sayının EKOK'u
export function lcmMultiple(numbers: number[]): number {
  if (numbers.length === 0) return 1;
  return numbers.reduce((acc, num) => lcm(acc, num), numbers[0]);
}

// Kesiri sadeleştir
export function simplifyFraction(fraction: Fraction): Fraction {
  if (fraction.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const divisor = gcd(fraction.numerator, fraction.denominator);
  return {
    numerator: fraction.numerator / divisor,
    denominator: fraction.denominator / divisor,
  };
}

// İki kesiri topla
export function addFractions(a: Fraction, b: Fraction): Fraction {
  const denominator = lcm(a.denominator, b.denominator);
  const numerator =
    (a.numerator * (denominator / a.denominator)) +
    (b.numerator * (denominator / b.denominator));
  return simplifyFraction({ numerator, denominator });
}

// İki kesiri çıkar
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const denominator = lcm(a.denominator, b.denominator);
  const numerator =
    (a.numerator * (denominator / a.denominator)) -
    (b.numerator * (denominator / b.denominator));
  return simplifyFraction({ numerator, denominator });
}

// Kesiri sayıyla çarp
export function multiplyFractionByNumber(fraction: Fraction, num: number): Fraction {
  return simplifyFraction({
    numerator: fraction.numerator * num,
    denominator: fraction.denominator,
  });
}

// İki kesiri çarp
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

// Kesiri sayıya böl
export function divideFractionByNumber(fraction: Fraction, num: number): Fraction {
  return simplifyFraction({
    numerator: fraction.numerator,
    denominator: fraction.denominator * num,
  });
}

// Kesiri ondalık sayıya çevir
export function fractionToDecimal(fraction: Fraction): number {
  if (fraction.denominator === 0) return 0;
  return fraction.numerator / fraction.denominator;
}

// Kesirleri karşılaştır
export function compareFractions(a: Fraction, b: Fraction): number {
  return fractionToDecimal(a) - fractionToDecimal(b);
}

// Kesir sıfır mı?
export function isZero(fraction: Fraction): boolean {
  return fraction.numerator === 0;
}

// Kesiri string olarak göster
export function fractionToString(fraction: Fraction): string {
  const simplified = simplifyFraction(fraction);
  if (simplified.numerator === 0) return '0';
  if (simplified.denominator === 1) return simplified.numerator.toString();
  return `${simplified.numerator}/${simplified.denominator}`;
}

// Kesiri Arapça olarak göster
export function fractionToArabic(fraction: Fraction): string {
  const arabicNumerals: { [key: number]: string } = {
    0: '٠', 1: '١', 2: '٢', 3: '٣', 4: '٤',
    5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩',
  };
  
  const toArabic = (num: number): string => {
    return num.toString().split('').map(d => arabicNumerals[parseInt(d)] || d).join('');
  };
  
  const simplified = simplifyFraction(fraction);
  if (simplified.numerator === 0) return '٠';
  if (simplified.denominator === 1) return toArabic(simplified.numerator);
  return `${toArabic(simplified.numerator)}/${toArabic(simplified.denominator)}`;
}

// Yüzde olarak göster
export function fractionToPercentage(fraction: Fraction): string {
  const percentage = fractionToDecimal(fraction) * 100;
  return percentage.toFixed(2) + '%';
}

// Birden fazla kesrin toplamı
export function sumFractions(fractions: Fraction[]): Fraction {
  if (fractions.length === 0) return { numerator: 0, denominator: 1 };
  return fractions.reduce((acc, f) => addFractions(acc, f), { numerator: 0, denominator: 1 });
}
