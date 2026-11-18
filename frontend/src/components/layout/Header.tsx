
import fa from "../../locales/fa";

interface HeaderProps {
    title?: string;
    description?: string;
}

export default function Header({
                                   title = fa.app.title,
                                   description = fa.app.description,
                               }: HeaderProps) {
    return (
        <header className="app-header">
            <div className="header-page-info">
                <h1 className="header-title">{title}</h1>
                <p className="header-description">{description}</p>
            </div>

            <div className="header-actions">
                <button
                    type="button"
                    className="header-icon-button"
                    aria-label={fa.header.notifications}
                    title={fa.header.notifications}
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>
                    <span className="notification-dot" />
                </button>

                <div className="header-divider" />

                <button type="button" className="header-profile">
                    <div className="profile-avatar">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>

                    <div className="profile-info">
            <span className="profile-name">
              {fa.header.administrator}
            </span>
                        <span className="profile-role">{fa.header.profile}</span>
                    </div>

                    <svg
                        className="profile-chevron"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
