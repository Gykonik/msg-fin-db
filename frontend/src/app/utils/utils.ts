export class Utils {
  public static getCurrencyClass(value: number): string {
    if(value === 0) return "neutral-amount";
    return (value < 0) ? 'negative-amount' : 'positive-amount'
  }

  public static getCurrencyPrefix(value: number): "" | "+" | "-" {
    if(value === 0) return "";
    return value < 0 ? '-' : '+'
  }
}
