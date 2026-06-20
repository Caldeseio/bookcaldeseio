import { describe, it, expect } from 'vitest'
import { CHAPTERS } from '../chapters'
import { PROJECTS } from '../projects'
import { SKILLS } from '../skills'

describe('CHAPTERS', () => {
  it('has 7 entries (index 0-6)', () => expect(CHAPTERS).toHaveLength(7))
  it('each has index, roman, titleKey, subtitleKey, narrativeKeys', () => {
    CHAPTERS.forEach(c => {
      expect(c).toHaveProperty('index')
      expect(c).toHaveProperty('roman')
      expect(c).toHaveProperty('titleKey')
      expect(c).toHaveProperty('subtitleKey')
      expect(c.narrativeKeys).toBeInstanceOf(Array)
    })
  })
  it('index values match position', () => {
    CHAPTERS.forEach((c, i) => expect(c.index).toBe(i))
  })
})

describe('PROJECTS', () => {
  it('has 6 entries', () => expect(PROJECTS).toHaveLength(6))
  it('each has id, titleKey, descKey, tech array', () => {
    PROJECTS.forEach(p => {
      expect(p.id).toBeGreaterThan(0)
      expect(typeof p.titleKey).toBe('string')
      expect(p.tech).toBeInstanceOf(Array)
      expect(p.tech.length).toBeGreaterThan(0)
    })
  })
})

describe('SKILLS', () => {
  it('has at least 10 entries', () => expect(SKILLS.length).toBeGreaterThanOrEqual(10))
  it('all levels are 0-100', () => {
    SKILLS.forEach(s => {
      expect(s.level).toBeGreaterThanOrEqual(0)
      expect(s.level).toBeLessThanOrEqual(100)
    })
  })
  it('all branches are valid', () => {
    const valid = new Set(['backend', 'frontend', 'data', 'devops'])
    SKILLS.forEach(s => expect(valid.has(s.branch)).toBe(true))
  })
})
