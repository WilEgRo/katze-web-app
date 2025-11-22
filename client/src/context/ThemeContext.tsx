import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type theme = "light" | "dark";

// inteface ThemeContextType se encarga de definir la estructura del contexto de tema
interface ThemeContextType {
    theme: theme;
    toggleTheme: () => void;
}

// Contexto de tema
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // revisar si ya habia un tema guardado en localStorage
    const [theme, setTheme] = useState<theme>(() => {
        if (localStorage.getItem("theme")) {
            return localStorage.getItem("theme") as theme;
        }
        return "light";
    });

    // cada vez que el tema cambie, actualizar el localStorage y el html
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    }
    return context;
}