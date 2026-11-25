
import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react'
import {
  getStatsContent,
  fetchStatsContent,
  saveStatsContent,
  resetStatsContent,
  type StatsContent,
} from '../../services/stats-content.service'
import type { StatItem } from '../../config/stats.config'

function StatsContentEditor() {
  const [content, setContent] = useState<StatsContent>(() =>
    getStatsContent(),
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchStatsContent().then((data) => {
      setContent(data)
    })
  }, [])

  const updateSectionField = (
    field: 'eyebrow' | 'title' | 'description',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))
    setMessage('')
  }

  const updateStat = (
    id: string,
    field: keyof StatItem,
    value: string | number | boolean,
  ) => {
    setContent((previous) => ({
      ...previous,
      stats: previous.stats.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat,
      ),
    }))
    setMessage('')
  }

  const addStat = () => {
const newStat: StatItem = {
  id: `stat-${Date.now()}`,
  label: 'New Statistic',
  value: 0,
  suffix: '+',
  description: 'Add a description for this statistic.',
  image: '',
  enabled: true,
}

    setContent((previous) => ({
      ...previous,
      stats: [...previous.stats, newStat],
    }))
    setMessage('')
  }

  const removeStat = (id: string) => {
    if (content.stats.length <= 1) {
      setMessage('At least one statistic must remain.')
      return
    }

    const remainingStats = content.stats.filter(
      (stat) => stat.id !== id,
    )

    setContent((previous) => ({
      ...previous,
      stats: remainingStats,
      featuredStatId:
        previous.featuredStatId === id
          ? remainingStats[0].id
          : previous.featuredStatId,
    }))
    setMessage('')
  }

  const moveStat = (id: string, direction: 'up' | 'down') => {
    setContent((previous) => {
      const currentIndex = previous.stats.findIndex(
        (stat) => stat.id === id,
      )

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= previous.stats.length
      ) {
        return previous
      }

      const updatedStats = [...previous.stats]
      ;[updatedStats[currentIndex], updatedStats[targetIndex]] = [
        updatedStats[targetIndex],
        updatedStats[currentIndex],
      ]

      return {
        ...previous,
        stats: updatedStats,
      }
    })
    setMessage('')
  }

  const handleSave = async () => {
    try {
      await saveStatsContent(content)
      setMessage('Stats content saved successfully.')
    } catch {
      setMessage('Unable to save. Please try again.')
    }
  }

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset all Stats content to its default values?',
    )

    if (!confirmed) return

    try {
      const defaultContent = await resetStatsContent()
      setContent(defaultContent)
      setMessage('Stats content has been reset.')
    } catch {
      setMessage('Unable to reset. Please try again.')
    }
  }

  return (
    <section className="content-editor-panel">
      <div className="content-editor-form">
        <div className="content-editor-group">
          <h3>Section Introduction</h3>

          <label>
            Eyebrow
            <input
              type="text"
              value={content.eyebrow}
              onChange={(event) =>
                updateSectionField('eyebrow', event.target.value)
              }
              placeholder="OUR IMPACT IN NUMBERS"
            />
          </label>

          <label>
            Heading
            <textarea
              rows={2}
              value={content.title}
              onChange={(event) =>
                updateSectionField('title', event.target.value)
              }
              placeholder="Section heading"
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={content.description}
              onChange={(event) =>
                updateSectionField('description', event.target.value)
              }
              placeholder="Section description"
            />
          </label>
        </div>

        <div className="content-editor-group">
          <div className="content-editor-list-heading">
            <div>
              <h3>Statistics</h3>
              <p>Manage the numbers displayed on your website.</p>
            </div>

            <button
              type="button"
              className="content-editor-add-button"
              onClick={addStat}
            >
              <Plus size={16} />
              Add Statistic
            </button>
          </div>

          {content.stats.map((stat, index) => (
            <article className="stats-editor-card" key={stat.id}>
              <div className="stats-editor-card-header">
                <h4>Statistic {index + 1}</h4>

                <button
                  type="button"
                  className="content-editor-delete-button"
                  onClick={() => removeStat(stat.id)}
                  title="Remove statistic"
                  aria-label={`Remove ${stat.label}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <label>
                Label
                <input
                  type="text"
                  value={stat.label}
                  onChange={(event) =>
                    updateStat(stat.id, 'label', event.target.value)
                  }
                />
              </label>

              <div className="stats-editor-fields">
                <label>
                  Number
                  <input
                    type="number"
                    min="0"
                    value={stat.value}
                    onChange={(event) =>
                      updateStat(
                        stat.id,
                        'value',
                        Math.max(0, Number(event.target.value)),
                      )
                    }
                  />
                </label>

                <label>
                  Suffix
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(event) =>
                      updateStat(stat.id, 'suffix', event.target.value)
                    }
                    placeholder="+, %, K"
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  rows={2}
                  value={stat.description}
                  onChange={(event) =>
                    updateStat(
                      stat.id,
                      'description',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Image URL
                <input
                  type="text"
                  value={stat.image}
                  onChange={(event) =>
                    updateStat(stat.id, 'image', event.target.value)
                  }
                  placeholder="/images/stats/projects.jpg"
                />
              </label>

              {stat.image && (
                <div className="stats-editor-image-preview">
                  <img src={stat.image} alt={stat.label} />
                </div>
              )}

              <div className="stats-editor-card-footer">
                <label className="service-editor-toggle">
                  <input
                    type="checkbox"
                    checked={stat.enabled !== false}
                    onChange={(event) =>
                      updateStat(
                        stat.id,
                        'enabled',
                        event.target.checked,
                      )
                    }
                  />
                  <span>Enabled</span>
                </label>

                <label className="stats-editor-featured">
                  <input
                    type="radio"
                    name="featured-stat"
                    checked={content.featuredStatId === stat.id}
                    onChange={() =>
                      setContent((previous) => ({
                        ...previous,
                        featuredStatId: stat.id,
                      }))
                    }
                  />
                  Featured card
                </label>
              </div>

              <div className="stats-editor-order">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveStat(stat.id, 'up')}
                >
                  Move up
                </button>

                <button
                  type="button"
                  disabled={index === content.stats.length - 1}
                  onClick={() => moveStat(stat.id, 'down')}
                >
                  Move down
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {message && (
        <p className="content-editor-message" role="status">
          {message}
        </p>
      )}

      <div className="content-editor-actions">
        <button
          type="button"
          className="content-editor-reset-button"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="content-editor-save-button"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default StatsContentEditor
