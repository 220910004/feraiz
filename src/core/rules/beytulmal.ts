export interface BeytulmalConfig {
  operational: boolean;
  note: string;
}

export const DEFAULT_BEYTULMAL_CONFIG: BeytulmalConfig = {
  operational: false,
  note: 'Varsayılan kabulde düzenli işleyen beytülmâl yok kabul edilir; bu ayar mezhepsel sonuçları etkileyebilir.',
};
