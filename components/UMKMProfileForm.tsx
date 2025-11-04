import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UMKMFormData, ValidationErrors } from "../types";
import { BackButton, Button, ImageUpload, Input, Select } from "./ui";

interface UMKMProfileFormProps {
  initialData?: Partial<UMKMFormData>;
  onSubmit: (data: UMKMFormData) => void;
  onBack?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const jenisUsahaOptions: string[] = [
  "Kuliner",
  "Fashion",
  "Kerajinan",
  "Teknologi",
  "Pertanian",
  "Jasa",
  "Perdagangan",
  "Lainnya",
];

export const UMKMProfileForm: React.FC<UMKMProfileFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<UMKMFormData>({
    namaUsaha: initialData.namaUsaha || "",
    jenisUsaha: initialData.jenisUsaha || "",
    deskripsiUsaha: initialData.deskripsiUsaha || "",
    alamatLengkap: initialData.alamatLengkap || "",
    kota: initialData.kota || "",
    provinsi: initialData.provinsi || "",
    kodePos: initialData.kodePos || "",
    nib: initialData.nib || "",
    nomorKontak: initialData.nomorKontak || "",
    email: initialData.email || "",
    website: initialData.website || "",
    fotoLogo: initialData.fotoLogo || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validasi field wajib
    if (!formData.namaUsaha.trim()) {
      newErrors.namaUsaha = "Nama usaha harus diisi";
    }

    if (!formData.jenisUsaha) {
      newErrors.jenisUsaha = "Jenis usaha harus dipilih";
    }

    if (!formData.alamatLengkap.trim()) {
      newErrors.alamatLengkap = "Alamat lengkap harus diisi";
    }

    if (!formData.kota.trim()) {
      newErrors.kota = "Kota harus diisi";
    }

    if (!formData.provinsi.trim()) {
      newErrors.provinsi = "Provinsi harus diisi";
    }

    if (!formData.kodePos.trim()) {
      newErrors.kodePos = "Kode pos harus diisi";
    } else if (!/^\d{5}$/.test(formData.kodePos)) {
      newErrors.kodePos = "Kode pos harus 5 digit angka";
    }

    if (!formData.nib.trim()) {
      newErrors.nib = "NIB harus diisi";
    } else if (!/^\d{13}$/.test(formData.nib)) {
      newErrors.nib = "NIB harus 13 digit angka";
    }

    if (!formData.nomorKontak.trim()) {
      newErrors.nomorKontak = "Nomor kontak harus diisi";
    } else if (
      !/^[\+]?[0-9]{10,15}$/.test(formData.nomorKontak.replace(/\s/g, ""))
    ) {
      newErrors.nomorKontak = "Format nomor kontak tidak valid";
    }

    // Validasi email jika diisi
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert("Peringatan", "Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const updateField = (field: keyof UMKMFormData, value: string) => {
    setFormData((prev: UMKMFormData) => ({ ...prev, [field]: value }));
    // Clear error ketika user mulai mengetik
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev: ValidationErrors) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header dengan tombol back */}
        {onBack && (
          <View className="bg-white border-b border-gray-200 px-4 py-4">
            <View className="flex-row items-center">
              <BackButton onPress={onBack} className="mr-4" />
              <Text className="text-lg font-semibold text-gray-900">
                {isEdit ? "Edit Profil UMKM" : "Tambah Profil UMKM"}
              </Text>
            </View>
          </View>
        )}
      <ScrollView className="flex-1">

        <View className="p-4">
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Profil UMKM
            </Text>

            {/* Informasi Dasar Usaha */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Informasi Dasar Usaha
              </Text>

              <Input
                label="Nama Usaha"
                value={formData.namaUsaha}
                onChangeText={(value: string) =>
                  updateField("namaUsaha", value)
                }
                placeholder="Masukkan nama usaha"
                error={errors.namaUsaha}
                required
              />

              <Select
                label="Jenis Usaha"
                value={formData.jenisUsaha}
                onValueChange={(value: string) =>
                  updateField("jenisUsaha", value)
                }
                options={jenisUsahaOptions}
                placeholder="Pilih jenis usaha"
                error={errors.jenisUsaha}
                required
              />

              <Input
                label="Deskripsi Usaha"
                value={formData.deskripsiUsaha}
                onChangeText={(value: string) =>
                  updateField("deskripsiUsaha", value)
                }
                placeholder="Deskripsi singkat tentang usaha"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Alamat Usaha */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Alamat Usaha
              </Text>

              <Input
                label="Alamat Lengkap"
                value={formData.alamatLengkap}
                onChangeText={(value: string) =>
                  updateField("alamatLengkap", value)
                }
                placeholder="Jalan, No, RT/RW, Kelurahan"
                error={errors.alamatLengkap}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                required
              />

              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Input
                    label="Kota"
                    value={formData.kota}
                    onChangeText={(value: string) => updateField("kota", value)}
                    placeholder="Nama kota"
                    error={errors.kota}
                    required
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Kode Pos"
                    value={formData.kodePos}
                    onChangeText={(value: string) =>
                      updateField("kodePos", value)
                    }
                    placeholder="12345"
                    keyboardType="numeric"
                    maxLength={5}
                    error={errors.kodePos}
                    required
                  />
                </View>
              </View>

              <Input
                label="Provinsi"
                value={formData.provinsi}
                onChangeText={(value: string) => updateField("provinsi", value)}
                placeholder="Nama provinsi"
                error={errors.provinsi}
                required
              />
            </View>

            {/* Foto/Logo Usaha */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Foto/Logo Usaha
              </Text>

              <ImageUpload
                label="Logo atau Foto Usaha"
                imageUri={formData.fotoLogo}
                onImageSelected={(uri: string) => updateField("fotoLogo", uri)}
                placeholder="Upload logo atau foto usaha"
                aspectRatio={[1, 1]}
              />
            </View>

            {/* Data Legal & Kontak */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Data Legal & Kontak
              </Text>

              <Input
                label="NIB (Nomor Induk Berusaha)"
                value={formData.nib}
                onChangeText={(value: string) => updateField("nib", value)}
                placeholder="1234567890123"
                keyboardType="numeric"
                maxLength={13}
                error={errors.nib}
                required
              />

              <Input
                label="Nomor Kontak"
                value={formData.nomorKontak}
                onChangeText={(value: string) =>
                  updateField("nomorKontak", value)
                }
                placeholder="+62 812 3456 7890"
                keyboardType="phone-pad"
                error={errors.nomorKontak}
                required
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value: string) => updateField("email", value)}
                placeholder="email@domain.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Website"
                value={formData.website}
                onChangeText={(value: string) => updateField("website", value)}
                placeholder="https://website-usaha.com"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <Button
              title={isEdit ? "Perbarui Profil" : "Simpan Profil"}
              onPress={handleSubmit}
              loading={loading}
              className="mt-4"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
