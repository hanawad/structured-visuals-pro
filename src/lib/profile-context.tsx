import { createContext, useContext, useState, type ReactNode } from "react";
import { SAMPLE_PROFILE, type Profile } from "./data";

type Ctx = { profile: Profile; isSample: boolean; save: (p: Profile) => void };
const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(SAMPLE_PROFILE);
  const [isSample, setIsSample] = useState(true);
  return (
    <ProfileContext.Provider
      value={{ profile, isSample, save: (p) => { setProfile(p); setIsSample(false); } }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const c = useContext(ProfileContext);
  if (!c) throw new Error("useProfile must be used inside ProfileProvider");
  return c;
}
