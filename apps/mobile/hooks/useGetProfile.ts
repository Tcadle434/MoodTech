import { useQuery } from "@tanstack/react-query";
import { authService } from "@/api/authService";

export const useGetProfile = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["profile"],
		queryFn: authService.getProfile,
	});

	return { data, isLoading, error };
};
