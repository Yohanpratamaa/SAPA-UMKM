import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: "@sapa_umkm:has_seen_onboarding",
  HAS_COMPLETED_INTRO: "@sapa_umkm:has_completed_intro",
  USER_TOKEN: "@sapa_umkm:user_token",
  USER_DATA: "@sapa_umkm:user_data",
} as const;

export class AppFlowService {
  /**
   * Check if user has seen onboarding
   */
  static async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(
        STORAGE_KEYS.HAS_SEEN_ONBOARDING
      );
      return value === "true";
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }

  /**
   * Mark onboarding as seen
   */
  static async markOnboardingSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, "true");
    } catch (error) {
      console.error("Error marking onboarding as seen:", error);
    }
  }

  /**
   * Check if user has completed intro flow
   */
  static async hasCompletedIntro(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(
        STORAGE_KEYS.HAS_COMPLETED_INTRO
      );
      return value === "true";
    } catch (error) {
      console.error("Error checking intro status:", error);
      return false;
    }
  }

  /**
   * Mark intro flow as completed
   */
  static async markIntroCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_INTRO, "true");
    } catch (error) {
      console.error("Error marking intro as completed:", error);
    }
  }

  /**
   * Reset app flow (for testing or logout)
   */
  static async resetAppFlow(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HAS_SEEN_ONBOARDING,
        STORAGE_KEYS.HAS_COMPLETED_INTRO,
      ]);
    } catch (error) {
      console.error("Error resetting app flow:", error);
    }
  }

  /**
   * Reset all app data (complete reset)
   */
  static async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HAS_SEEN_ONBOARDING,
        STORAGE_KEYS.HAS_COMPLETED_INTRO,
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error resetting all data:", error);
    }
  }

  /**
   * Get current app flow state
   */
  static async getCurrentFlowState(): Promise<{
    hasSeenOnboarding: boolean;
    hasCompletedIntro: boolean;
  }> {
    try {
      const [hasSeenOnboarding, hasCompletedIntro] = await Promise.all([
        this.hasSeenOnboarding(),
        this.hasCompletedIntro(),
      ]);

      return {
        hasSeenOnboarding,
        hasCompletedIntro,
      };
    } catch (error) {
      console.error("Error getting current flow state:", error);
      return {
        hasSeenOnboarding: false,
        hasCompletedIntro: false,
      };
    }
  }
}
