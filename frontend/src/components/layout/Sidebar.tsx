
import { NavLink } from "react-router-dom";
import fa from "../../locales/fa";

const menuItems = [
    {
        label: fa.navigation.complaintCreate,
        path: "/complaints/create",
        icon: "plus",
    },
    {
        label: fa.navigation.complaintList,
        path: "/complaints",
        icon: "list",
    },
];

function MenuIcon({ name }: { name: string }) {
    const commonProps = {
        width: 19,
        height: 19,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    if (name === "plus") {
        return (
            <svg {...commonProps}>
                <path d="M12 5v14M5 12h14" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M9 10v10" />
        </svg>
    );
}

export default function Sidebar() {
    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <div className="brand-symbol">
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
                        <path d="m3 12 9 5 9-5" />
                        <path d="m3 16 9 5 9-5" />
                    </svg>
                </div>

                <div className="brand-info">
                    <span className="brand-title">{fa.app.shortTitle}</span>
                    <span className="brand-subtitle">{fa.app.description}</span>
                </div>
            </div>

            <div className="sidebar-menu">
                <p className="sidebar-section-title">
                    {fa.navigation.complaints}
                </p>

                <nav>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/complaints"}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <MenuIcon name={item.icon} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-footer-mark" />
                <span>{fa.app.title}</span>
            </div>
        </aside>
    );
}
