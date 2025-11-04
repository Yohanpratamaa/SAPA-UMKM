import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KATEGORI_TRAINING,
  KategoriTraining,
  LEVEL_TRAINING,
  LevelTraining,
  TIPE_KONTEN,
  TIPE_TRAINING,
  TipeKonten,
  TipeTraining,
  TrainingFormData,
  TrainingModule,
  TrainingValidationErrors,
} from "../types";
import { BackButton, Button, Input, MultiImageUpload } from "./ui";

// Simple Select Component for Training Form
interface SimpleSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Pilih opsi...",
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`border rounded-lg px-4 py-3 flex-row items-center justify-between ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <Text className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      <Modal visible={isOpen} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-lg max-h-96">
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-semibold">{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`p-4 border-b border-gray-100 ${
                    value === item ? "bg-blue-50" : ""
                  }`}
                >
                  <Text
                    className={
                      value === item
                        ? "text-blue-600 font-medium"
                        : "text-gray-900"
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Module Form Component
interface ModuleFormProps {
  module: Omit<TrainingModule, "id" | "isSelesai">;
  onUpdate: (module: Omit<TrainingModule, "id" | "isSelesai">) => void;
  onDelete: () => void;
  index: number;
}

const ModuleForm: React.FC<ModuleFormProps> = ({
  module,
  onUpdate,
  onDelete,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="bg-gray-50 rounded-lg p-4 mb-3">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between"
      >
        <Text className="text-gray-900 font-medium">
          Modul {index + 1}: {module.judul || "Untitled"}
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onDelete}
            className="bg-red-100 p-1 rounded mr-2"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-4 space-y-4">
          <Input
            label="Judul Modul"
            placeholder="Masukkan judul modul"
            value={module.judul}
            onChangeText={(value) => onUpdate({ ...module, judul: value })}
            required
          />

          <Input
            label="Deskripsi Modul"
            placeholder="Masukkan deskripsi modul"
            value={module.deskripsi}
            onChangeText={(value) => onUpdate({ ...module, deskripsi: value })}
            multiline
            numberOfLines={3}
          />

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Input
                label="Durasi (menit)"
                placeholder="60"
                value={module.durasi.toString()}
                onChangeText={(value) =>
                  onUpdate({ ...module, durasi: parseInt(value) || 0 })
                }
                keyboardType="numeric"
                required
              />
            </View>
            <View className="flex-1">
              <Input
                label="Urutan"
                placeholder="1"
                value={module.urutan.toString()}
                onChangeText={(value) =>
                  onUpdate({ ...module, urutan: parseInt(value) || 0 })
                }
                keyboardType="numeric"
                required
              />
            </View>
          </View>

          <SimpleSelect
            label="Tipe Konten"
            value={module.tipeKonten}
            onValueChange={(value) =>
              onUpdate({ ...module, tipeKonten: value as TipeKonten })
            }
            options={TIPE_KONTEN}
            required
          />

          <Input
            label="URL Konten"
            placeholder="https://example.com/video.mp4"
            value={module.kontenUrl}
            onChangeText={(value) => onUpdate({ ...module, kontenUrl: value })}
            required
          />

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                onUpdate({ ...module, isGratis: !module.isGratis })
              }
              className="flex-row items-center"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  module.isGratis
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {module.isGratis && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-700">Modul gratis</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Main Training Form Component
interface TrainingFormProps {
  initialData?: Partial<TrainingFormData>;
  onSubmit: (data: TrainingFormData) => void;
  onBack?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    judul: initialData.judul || "",
    deskripsi: initialData.deskripsi || "",
    thumbnail: initialData.thumbnail || "",
    kategori: initialData.kategori || KategoriTraining.DIGITAL_MARKETING,
    tipeTraining: initialData.tipeTraining || TipeTraining.ONLINE,
    level: initialData.level || LevelTraining.PEMULA,
    durasi: initialData.durasi || 0,
    harga: initialData.harga || 0,
    instruktur: initialData.instruktur || "",
    prerequisites: initialData.prerequisites || [],
    tags: initialData.tags || [],
    tanggalMulai: initialData.tanggalMulai,
    tanggalSelesai: initialData.tanggalSelesai,
    sertifikatTersedia: initialData.sertifikatTersedia || false,
    videoUrl: initialData.videoUrl || "",
    materiUrl: initialData.materiUrl || [],
    modules: initialData.modules || [],
  });

  const [errors, setErrors] = useState<TrainingValidationErrors>({});
  const [newTag, setNewTag] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");

  const validateForm = (): boolean => {
    const newErrors: TrainingValidationErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul pelatihan harus diisi";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi pelatihan harus diisi";
    }

    if (!formData.instruktur.trim()) {
      newErrors.instruktur = "Nama instruktur harus diisi";
    }

    if (formData.durasi <= 0) {
      newErrors.durasi = "Durasi harus lebih dari 0 menit";
    }

    if (formData.harga < 0) {
      newErrors.harga = "Harga tidak boleh negatif";
    }

    if (formData.tanggalMulai && formData.tanggalSelesai) {
      if (formData.tanggalMulai >= formData.tanggalSelesai) {
        newErrors.tanggalSelesai =
          "Tanggal selesai harus setelah tanggal mulai";
      }
    }

    if (formData.modules.length === 0) {
      newErrors.modules = "Minimal harus ada 1 modul pembelajaran";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert("Error", "Mohon periksa kembali data yang diisi");
    }
  };

  const handleInputChange = (field: keyof TrainingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof TrainingValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPrerequisite = () => {
    if (
      newPrerequisite.trim() &&
      !formData.prerequisites.includes(newPrerequisite.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }));
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(
        (prereq) => prereq !== prerequisiteToRemove
      ),
    }));
  };

  const addModule = () => {
    const newModule: Omit<TrainingModule, "id" | "isSelesai"> = {
      judul: "",
      deskripsi: "",
      durasi: 0,
      urutan: formData.modules.length + 1,
      tipeKonten: TipeKonten.VIDEO,
      kontenUrl: "",
      isGratis: true,
    };

    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const updateModule = (
    index: number,
    updatedModule: Omit<TrainingModule, "id" | "isSelesai">
  ) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === index ? updatedModule : module
      ),
    }));
  };

  const deleteModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 pt-2 pb-4">
        <View className="flex-row items-center">
          {onBack && <BackButton onPress={onBack} className="mr-4" />}
          <Text className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Pelatihan" : "Tambah Pelatihan"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-4">
          {/* Basic Information */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Dasar
            </Text>

            <Input
              label="Judul Pelatihan"
              placeholder="Masukkan judul pelatihan"
              value={formData.judul}
              onChangeText={(value) => handleInputChange("judul", value)}
              error={errors.judul}
              required
            />

            <Input
              label="Deskripsi"
              placeholder="Masukkan deskripsi pelatihan"
              value={formData.deskripsi}
              onChangeText={(value) => handleInputChange("deskripsi", value)}
              error={errors.deskripsi}
              multiline
              numberOfLines={4}
              required
            />

            <Input
              label="Nama Instruktur"
              placeholder="Masukkan nama instruktur"
              value={formData.instruktur}
              onChangeText={(value) => handleInputChange("instruktur", value)}
              error={errors.instruktur}
              required
            />

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Input
                  label="Durasi (menit)"
                  placeholder="120"
                  value={formData.durasi.toString()}
                  onChangeText={(value) =>
                    handleInputChange("durasi", parseInt(value) || 0)
                  }
                  keyboardType="numeric"
                  error={errors.durasi}
                  required
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Harga (Rp)"
                  placeholder="0"
                  value={formData.harga.toString()}
                  onChangeText={(value) =>
                    handleInputChange("harga", parseInt(value) || 0)
                  }
                  keyboardType="numeric"
                  error={errors.harga}
                />
              </View>
            </View>
          </View>

          {/* Category and Type */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Kategori & Tipe
            </Text>

            <SimpleSelect
              label="Kategori"
              value={formData.kategori}
              onValueChange={(value) =>
                handleInputChange("kategori", value as KategoriTraining)
              }
              options={KATEGORI_TRAINING}
              required
            />

            <SimpleSelect
              label="Tipe Pelatihan"
              value={formData.tipeTraining}
              onValueChange={(value) =>
                handleInputChange("tipeTraining", value as TipeTraining)
              }
              options={TIPE_TRAINING}
              required
            />

            <SimpleSelect
              label="Level"
              value={formData.level}
              onValueChange={(value) =>
                handleInputChange("level", value as LevelTraining)
              }
              options={LEVEL_TRAINING}
              required
            />
          </View>

          {/* Certificate and Media */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Sertifikat & Media
            </Text>

            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() =>
                  handleInputChange(
                    "sertifikatTersedia",
                    !formData.sertifikatTersedia
                  )
                }
                className="flex-row items-center"
              >
                <View
                  className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                    formData.sertifikatTersedia
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {formData.sertifikatTersedia && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-gray-700">Sertifikat tersedia</Text>
              </TouchableOpacity>
            </View>

            <Input
              label="URL Video Utama"
              placeholder="https://example.com/video.mp4"
              value={formData.videoUrl}
              onChangeText={(value) => handleInputChange("videoUrl", value)}
            />

            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Thumbnail
              </Text>
              <MultiImageUpload
                images={formData.thumbnail ? [formData.thumbnail] : []}
                onImageAdd={(uri: string) =>
                  handleInputChange("thumbnail", uri)
                }
                onImageRemove={() => handleInputChange("thumbnail", "")}
                maxImages={1}
              />
            </View>
          </View>

          {/* Tags */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Tags
            </Text>

            <View className="flex-row items-center mb-3">
              <View className="flex-1 mr-2">
                <Input
                  placeholder="Tambah tag"
                  value={newTag}
                  onChangeText={setNewTag}
                />
              </View>
              <TouchableOpacity
                onPress={addTag}
                className="bg-blue-600 px-4 py-3 rounded-lg"
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {formData.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-blue-800 text-sm mr-1">{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close" size={14} color="#1E40AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Prerequisites */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Prasyarat
            </Text>

            <View className="flex-row items-center mb-3">
              <View className="flex-1 mr-2">
                <Input
                  placeholder="Tambah prasyarat"
                  value={newPrerequisite}
                  onChangeText={setNewPrerequisite}
                />
              </View>
              <TouchableOpacity
                onPress={addPrerequisite}
                className="bg-green-600 px-4 py-3 rounded-lg"
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {formData.prerequisites.map((prerequisite, index) => (
              <View
                key={index}
                className="bg-gray-100 px-3 py-2 rounded-lg mb-2 flex-row items-center justify-between"
              >
                <Text className="text-gray-800 flex-1">{prerequisite}</Text>
                <TouchableOpacity
                  onPress={() => removePrerequisite(prerequisite)}
                >
                  <Ionicons name="close" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Modules */}
          <View className="bg-white rounded-lg p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Modul Pembelajaran
              </Text>
              <TouchableOpacity
                onPress={addModule}
                className="bg-green-600 px-3 py-2 rounded-lg flex-row items-center"
              >
                <Ionicons name="add" size={16} color="white" />
                <Text className="text-white ml-1 text-sm">Tambah Modul</Text>
              </TouchableOpacity>
            </View>

            {errors.modules && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.modules}
              </Text>
            )}

            {formData.modules.map((module, index) => (
              <ModuleForm
                key={index}
                module={module}
                onUpdate={(updatedModule) => updateModule(index, updatedModule)}
                onDelete={() => deleteModule(index)}
                index={index}
              />
            ))}

            {formData.modules.length === 0 && (
              <Text className="text-gray-500 text-center py-8">
                Belum ada modul pembelajaran. Tambahkan minimal 1 modul.
              </Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View className="p-4">
          <Button
            title={isEdit ? "Update Pelatihan" : "Simpan Pelatihan"}
            onPress={handleSubmit}
            loading={loading}
            className="bg-blue-600"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
