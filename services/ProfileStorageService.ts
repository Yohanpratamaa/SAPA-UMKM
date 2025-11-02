import AsyncStorage from "@react-native-async-storage/async-storage";
import { UMKMFormData, UMKMProfile } from "../types";

const STORAGE_KEY = "SAPA_UMKM_PROFILES";

export class ProfileStorageService {
  static async saveProfile(profile: UMKMProfile): Promise<void> {
    try {
      const profiles = await this.getAllProfiles();
      const existingIndex = profiles.findIndex((p) => p.id === profile.id);

      if (existingIndex >= 0) {
        profiles[existingIndex] = profile;
      } else {
        profiles.push(profile);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error("Error saving profile:", error);
      throw new Error("Gagal menyimpan profil UMKM");
    }
  }

  static async getAllProfiles(): Promise<UMKMProfile[]> {
    try {
      const profilesJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (profilesJson) {
        const profiles = JSON.parse(profilesJson);
        // Convert date strings back to Date objects
        return profiles.map((profile: any) => ({
          ...profile,
          tanggalDaftar: new Date(profile.tanggalDaftar),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting profiles:", error);
      return [];
    }
  }

  static async getProfileById(id: string): Promise<UMKMProfile | null> {
    try {
      const profiles = await this.getAllProfiles();
      return profiles.find((p) => p.id === id) || null;
    } catch (error) {
      console.error("Error getting profile by ID:", error);
      return null;
    }
  }

  static async deleteProfile(id: string): Promise<void> {
    try {
      const profiles = await this.getAllProfiles();
      const filteredProfiles = profiles.filter((p) => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProfiles));
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw new Error("Gagal menghapus profil UMKM");
    }
  }

  static async updateProfileStatus(
    id: string,
    status: UMKMProfile["status"]
  ): Promise<void> {
    try {
      const profiles = await this.getAllProfiles();
      const profileIndex = profiles.findIndex((p) => p.id === id);

      if (profileIndex >= 0) {
        profiles[profileIndex].status = status;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      } else {
        throw new Error("Profil tidak ditemukan");
      }
    } catch (error) {
      console.error("Error updating profile status:", error);
      throw new Error("Gagal mengupdate status profil");
    }
  }

  static async searchProfiles(query: string): Promise<UMKMProfile[]> {
    try {
      const profiles = await this.getAllProfiles();
      const lowercaseQuery = query.toLowerCase();

      return profiles.filter(
        (profile) =>
          profile.namaUsaha.toLowerCase().includes(lowercaseQuery) ||
          profile.jenisUsaha.toLowerCase().includes(lowercaseQuery) ||
          profile.kota.toLowerCase().includes(lowercaseQuery) ||
          profile.provinsi.toLowerCase().includes(lowercaseQuery) ||
          profile.nib.includes(query)
      );
    } catch (error) {
      console.error("Error searching profiles:", error);
      return [];
    }
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static formDataToProfile(formData: UMKMFormData): UMKMProfile {
    return {
      id: this.generateId(),
      namaUsaha: formData.namaUsaha,
      jenisUsaha: formData.jenisUsaha,
      deskripsiUsaha: formData.deskripsiUsaha,
      alamatLengkap: formData.alamatLengkap,
      kota: formData.kota,
      provinsi: formData.provinsi,
      kodePos: formData.kodePos,
      nib: formData.nib,
      nomorKontak: formData.nomorKontak,
      email: formData.email,
      website: formData.website,
      fotoLogo: formData.fotoLogo,
      tanggalDaftar: new Date(),
      status: "aktif",
    };
  }

  static profileToFormData(profile: UMKMProfile): UMKMFormData {
    return {
      namaUsaha: profile.namaUsaha,
      jenisUsaha: profile.jenisUsaha,
      deskripsiUsaha: profile.deskripsiUsaha || "",
      alamatLengkap: profile.alamatLengkap,
      kota: profile.kota,
      provinsi: profile.provinsi,
      kodePos: profile.kodePos,
      nib: profile.nib,
      nomorKontak: profile.nomorKontak,
      email: profile.email || "",
      website: profile.website || "",
      fotoLogo: profile.fotoLogo || "",
    };
  }
}
