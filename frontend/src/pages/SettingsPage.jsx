import { useTheme } from '../context/ThemeContext';

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h2 className="page-title">Settings</h2>
      <div className="card">
        <div className="settings-row">
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Dark Mode</p>
            <p className="card-meta">Switch between light and dark theme.</p>
          </div>
          <button
            className={`toggle-switch ${theme === 'dark' ? 'toggle-switch-on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <span className="toggle-switch-knob" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;