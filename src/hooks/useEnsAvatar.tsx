import { EnsInfoParams, getEnsAvatarCached } from "@/data/getEns";
import { useQuery } from "@tanstack/react-query";

export function useEnsAvatar({ address }: EnsInfoParams) {
  const ensAvatar = useQuery({
    queryFn: () => getEnsAvatarCached({ address }),
    queryKey: ["use-ens-avatar", address],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return ensAvatar;
}
