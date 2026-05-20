export type MilestoneKey =
  | 'baekil'
  | 'dol'
  | 'primary_entry'
  | 'primary_grad'
  | 'middle_entry'
  | 'middle_grad'
  | 'high_entry'
  | 'suneung_d100'
  | 'age_18'
  | 'army_entry'
  | 'wedding_eve'
  | 'age_30';

export type Milestone = {
  key: MilestoneKey;
  nameKr: string;
  description?: string;
  gender?: 'male' | 'female';
  /**
   * 자녀 생일을 기준으로 그날 계산. null을 반환하면 사용자가 직접 날짜 지정 필요(예: 결혼식).
   */
  calculate: (birthdate: Date) => Date | null;
};

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function addYears(d: Date, years: number): Date {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + years);
  return r;
}

export const MILESTONES: Milestone[] = [
  {
    key: 'baekil',
    nameKr: '백일',
    description: '태어난 지 100일',
    calculate: (b) => addDays(b, 100),
  },
  { key: 'dol', nameKr: '돌', description: '첫 생일', calculate: (b) => addYears(b, 1) },
  {
    key: 'primary_entry',
    nameKr: '초등학교 입학',
    description: '7세 봄',
    calculate: (b) => addYears(b, 7),
  },
  {
    key: 'primary_grad',
    nameKr: '초등학교 졸업',
    description: '13세 봄',
    calculate: (b) => addYears(b, 13),
  },
  {
    key: 'middle_entry',
    nameKr: '중학교 입학',
    description: '13세 봄',
    calculate: (b) => addYears(b, 13),
  },
  {
    key: 'middle_grad',
    nameKr: '중학교 졸업',
    description: '16세 봄',
    calculate: (b) => addYears(b, 16),
  },
  {
    key: 'high_entry',
    nameKr: '고등학교 입학',
    description: '16세 봄',
    calculate: (b) => addYears(b, 16),
  },
  {
    key: 'suneung_d100',
    nameKr: '수능 D-100',
    description: '18세 가을, 수능 100일 전',
    calculate: (b) => addDays(addYears(b, 18), -100),
  },
  {
    key: 'age_18',
    nameKr: '성년식',
    description: '만 18세 생일',
    calculate: (b) => addYears(b, 18),
  },
  {
    key: 'army_entry',
    nameKr: '군 입대',
    description: '만 20세 무렵',
    gender: 'male',
    calculate: (b) => addYears(b, 20),
  },
  {
    key: 'wedding_eve',
    nameKr: '결혼식 전날',
    description: '날짜 직접 지정',
    calculate: () => null,
  },
  { key: 'age_30', nameKr: '서른', description: '만 30세 생일', calculate: (b) => addYears(b, 30) },
];

export function getMilestone(key: MilestoneKey): Milestone | undefined {
  return MILESTONES.find((m) => m.key === key);
}

export type ResolvedMilestone = {
  milestone: Milestone;
  date: Date | null;
  passed: boolean;
};

export function resolveMilestones(
  birthdate: Date,
  options: { gender?: 'male' | 'female' | 'other'; now?: Date } = {}
): ResolvedMilestone[] {
  const now = options.now ?? new Date();
  return MILESTONES
    .filter((m) => !m.gender || m.gender === options.gender)
    .map((milestone) => {
      const date = milestone.calculate(birthdate);
      return {
        milestone,
        date,
        passed: date ? date.getTime() < now.getTime() : false,
      };
    });
}

/**
 * 특정 시점에 자녀가 만 몇 세인지. 음수면 태어나기 전.
 */
export function calculateAgeYears(birthdate: Date, at: Date): number {
  const yearDiff = at.getFullYear() - birthdate.getFullYear();
  const monthDiff = at.getMonth() - birthdate.getMonth();
  const dayDiff = at.getDate() - birthdate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return yearDiff - 1;
  }
  return yearDiff;
}

export function formatAgeAtThen(birthdate: Date, at: Date): string {
  const years = calculateAgeYears(birthdate, at);
  if (years < 0) return '태어나기 전';
  if (years === 0) {
    const days = Math.floor((at.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24));
    return `생후 ${days}일`;
  }
  return `만 ${years}세`;
}
