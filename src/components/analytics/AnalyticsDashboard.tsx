
import {
  Activity,
  BarChart3,
  Globe2,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import { analyticsConfig } from '../../config/analytics.config'
import AnimatedCounter from '../ui/AnimatedCounter'
import './AnalyticsDashboard.css'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
LineChart,
} from 'recharts'

const chartColors = [
  '#2f7655',
  '#65a77e',
  '#a1c9a9',
  '#d3e5d5',
]
const metricIcons = {
  projects: BarChart3,
  clients: Activity,
  regions: Globe2,
  satisfaction: TrendingUp,
}

function AnalyticsDashboard() {
    const visibility = analyticsConfig.visibility
    if (!visibility.section) {
  return null
}
  return (
    <section className="analytics-section" id="impact-analytics">
      <div className="analytics-container">
        <div className="analytics-heading">
          <div>
            <span className="analytics-eyebrow">
              <span />
              DATA, INSIGHTS & PERFORMANCE
            </span>

            <h2>
              Measuring impact.
              <br />
              <span>Visualizing progress.</span>
            </h2>

            <p>
              Explore the insights, milestones and measurable
              outcomes behind our work.
            </p>
          </div>

          <div className="analytics-live-label">
            <span />
            ILLUSTRATIVE DATA
          </div>
        </div>

{visibility.metrics && (
        <div className="analytics-metrics">
          {analyticsConfig.metrics.map((metric) => {
            const Icon =
              metricIcons[metric.id as keyof typeof metricIcons]

            return (
              <article className="analytics-metric-card" key={metric.id}>
                <div className="analytics-metric-top">
                  <span>{metric.label}</span>

                  <div className="analytics-metric-icon">
                    {Icon && <Icon size={19} />}
                  </div>
                </div>

                <h3>
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                  />
                </h3>

                <p>{metric.description}</p>
              </article>
            )
          })}
        </div>
        )}
{(visibility.distribution ||
  visibility.comparison ||
  visibility.trends) && (
        <div className="analytics-chart-grid">
          <article className="analytics-chart-card analytics-distribution-card">
            <div className="analytics-card-heading">
              <div>
                <span>01 / DISTRIBUTION</span>
                <h3>Impact by Category</h3>
              </div>
              <PieChart size={20} />
            </div>

<div className="analytics-donut-wrapper">
  <ResponsiveContainer width="100%" height="100%">
    <RechartsPieChart>
      <Pie
        data={analyticsConfig.distribution}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius="58%"
        outerRadius="82%"
        paddingAngle={3}
        stroke="none"
      >
        {analyticsConfig.distribution.map((entry, index) => (
          <Cell
            key={entry.name}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value) => [`${value}%`, 'Share']}
        contentStyle={{
          borderRadius: '10px',
          border: '1px solid #e0ebe3',
          fontSize: '12px',
        }}
      />
    </RechartsPieChart>
  </ResponsiveContainer>

  <div className="analytics-donut-center">
    <strong>100%</strong>
    <span>Total Share</span>
  </div>
</div>

<div className="analytics-chart-legend">
  {analyticsConfig.distribution.map((item, index) => (
    <div className="analytics-legend-item" key={item.name}>
      <span
        className="analytics-legend-dot"
        style={{
          backgroundColor: chartColors[index % chartColors.length],
        }}
      />
      <span>{item.name}</span>
      <strong>{item.value}%</strong>
    </div>
  ))}
</div>

<p className="analytics-demo-note">
  Illustrative distribution data · Replace with verified figures
</p>
          </article>
{visibility.comparison && (
          <article className="analytics-chart-card">
            <div className="analytics-card-heading">
              <div>
                <span>02 / COMPARISON</span>
                <h3>Performance Overview</h3>
              </div>
              <BarChart3 size={20} />
            </div>

            <div className="analytics-bar-wrapper">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={analyticsConfig.comparison}
      margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#e8eee9"
      />

      <XAxis
        dataKey="name"
        tick={{ fill: '#829187', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        tick={{ fill: '#829187', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />

      <Tooltip />

      <Legend />

      <Bar
        dataKey="projects"
        name="Projects"
        fill="#2f7655"
        radius={[5, 5, 0, 0]}
      />

      <Bar
        dataKey="impact"
        name="Impact score"
        fill="#a1c9a9"
        radius={[5, 5, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

<p className="analytics-demo-note">
  Illustrative comparison data · Replace with verified figures
</p>
          </article>
)}
{visibility.trends && (
          <article className="analytics-chart-card analytics-trend-card">
            <div className="analytics-card-heading">
              <div>
                <span>03 / GROWTH</span>
                <h3>Progress Over Time</h3>
              </div>
              <TrendingUp size={20} />
            </div>
<div className="analytics-trend-wrapper">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={analyticsConfig.trends}
      margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#e8eee9"
      />

      <XAxis
        dataKey="month"
        tick={{ fill: '#829187', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        yAxisId="projects"
        tick={{ fill: '#829187', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        yAxisId="beneficiaries"
        orientation="right"
        tick={{ fill: '#829187', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />

      <Tooltip />

      <Legend />

      <Line
        yAxisId="projects"
        type="monotone"
        dataKey="projects"
        name="Projects"
        stroke="#047857"
        strokeWidth={3}
        dot={{ r: 3 }}
        activeDot={{ r: 6 }}
        animationDuration={1200}
      />

      <Line
        yAxisId="beneficiaries"
        type="monotone"
        dataKey="beneficiaries"
        name="Beneficiaries"
        stroke="#10b981"
        strokeWidth={3}
        dot={{ r: 3 }}
        activeDot={{ r: 6 }}
        animationDuration={1500}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

<p className="analytics-demo-note">
  Illustrative monthly trend data · Replace with verified figures
</p>
          </article>
          )}
        </div>
        )}
      </div>
    </section>
  )
}

export default AnalyticsDashboard
