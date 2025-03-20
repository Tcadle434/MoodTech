import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User as SharedUser } from "shared";
import { User, ensureUserWithOnboardingStatus } from "@/types/user";
import apiClient from "@/api/client";
import apiConfig from "@/api/config";
import { hasValidTokens } from "@/utils/tokenStorage";

interface AuthContextData {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	login: (email: string, password: string) => Promise<any>;
	register: (email: string, password: string, name?: string) => Promise<any>;
	logout: () => Promise<void>;
	updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [user, setUser] = useState<User | null>(null);

	// Initialize on first mount
	useEffect(() => {
		const initializeAuth = async () => {
			setIsLoading(true);
			try {
				// Check if we have a stored token
				const hasToken = await hasValidTokens();

				if (hasToken) {
					// If we have a token, fetch the current user
					const userData = await apiClient.get(apiConfig.USERS.PROFILE);
					const userWithOnboardingStatus = ensureUserWithOnboardingStatus(userData);
					setUser(userWithOnboardingStatus);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Auth initialization error:", error);
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	// Login function
	const login = async (email: string, password: string) => {
		try {
			setIsLoading(true);
			const response = await apiClient.login(email, password);
			const userWithOnboardingStatus = ensureUserWithOnboardingStatus(response.user);
			setUser(userWithOnboardingStatus);
			setIsAuthenticated(true);
			return response;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Register function
	const register = async (email: string, password: string, name?: string) => {
		try {
			setIsLoading(true);
			const response = await apiClient.register(email, password, name);
			const userWithOnboardingStatus = ensureUserWithOnboardingStatus(response.user);
			setUser(userWithOnboardingStatus);
			setIsAuthenticated(true);
			return response;
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		setIsLoading(true);
		try {
			await apiClient.logout();
			setIsAuthenticated(false);
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Update user function - directly updates the user state with partial data
	const updateUser = (userData: Partial<User>) => {
		setUser((prevUser) => {
			if (!prevUser) return null;
			return { ...prevUser, ...userData };
		});
	};

	// Provide the updated context value
	const contextValue: AuthContextData = {
		isAuthenticated,
		isLoading,
		user,
		login,
		register,
		logout,
		updateUser,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
