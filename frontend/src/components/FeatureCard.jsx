const ACCENT_STYLE_MAP = {
    "accent-ai": {
        border: "hover:border-accent-ai/50",
        glow: "bg-accent-ai/5",
        bar: "bg-accent-ai",
        icon: "text-accent-ai",
        title: "group-hover:text-accent-ai"
    },
    "accent-cyan": {
        border: "hover:border-accent-cyan/50",
        glow: "bg-accent-cyan/5",
        bar: "bg-accent-cyan",
        icon: "text-accent-cyan",
        title: "group-hover:text-accent-cyan"
    },
    "accent-safe": {
        border: "hover:border-accent-safe/50",
        glow: "bg-accent-safe/5",
        bar: "bg-accent-safe",
        icon: "text-accent-safe",
        title: "group-hover:text-accent-safe"
    },
    "accent-danger": {
        border: "hover:border-accent-danger/50",
        glow: "bg-accent-danger/5",
        bar: "bg-accent-danger",
        icon: "text-accent-danger",
        title: "group-hover:text-accent-danger"
    }
};

const FeatureCard = ({ icon: Icon, title, description, accentColor = "accent-ai" }) => {
    const styles = ACCENT_STYLE_MAP[accentColor] || ACCENT_STYLE_MAP["accent-ai"];

    return (
        <div className={`h-full p-8 bg-white dark:bg-secondary/40 border border-gray-100 dark:border-white/10 rounded-2xl ${styles.border} transition-all duration-500 group overflow-hidden relative shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col`}>
            {/* Hover Accent Glow */}
            <div className={`absolute inset-0 ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Left Accent Bar */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${styles.bar} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-20`} />

            {/* Icon Container */}
            <div className={`relative z-10 w-14 h-14 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 border border-gray-100 dark:border-white/5 ${styles.icon} group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                <Icon className="w-7 h-7" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1">
                <h3 className={`text-xl font-bold mb-4 text-gray-900 dark:text-white ${styles.title} transition-colors`}>
                    {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors flex-1">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default FeatureCard;
