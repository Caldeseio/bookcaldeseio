import type { ChapterData } from '@/types'

export const CHAPTERS: ChapterData[] = [
  { index: 0, roman: '',    titleKey: 'book.title', subtitleKey: 'book.subtitle', narrativeKeys: [] },
  { index: 1, roman: 'I',   titleKey: 'ch1.title',  subtitleKey: 'ch1.subtitle',  narrativeKeys: ['ch1.line1', 'ch1.line2'] },
  { index: 2, roman: 'II',  titleKey: 'ch2.title',  subtitleKey: 'ch2.subtitle',  narrativeKeys: ['ch2.line1', 'ch2.line2'] },
  { index: 3, roman: 'III', titleKey: 'ch3.title',  subtitleKey: 'ch3.subtitle',  narrativeKeys: ['ch3.line1', 'ch3.line2'] },
  { index: 4, roman: 'IV',  titleKey: 'ch4.title',  subtitleKey: 'ch4.subtitle',  narrativeKeys: ['ch4.line1', 'ch4.line2'] },
]
