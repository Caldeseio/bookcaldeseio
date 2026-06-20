export type ChapterIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Lang = 'es' | 'en'
export type SkillBranch = 'backend' | 'frontend' | 'data' | 'devops'

export interface ChapterData {
  index: ChapterIndex
  roman: string
  titleKey: string
  subtitleKey: string
  narrativeKeys: string[]
}

export interface Project {
  id: number
  titleKey: string
  descKey: string
  tech: string[]
}

export interface SkillNode {
  name: string
  level: number
  branch: SkillBranch
}
