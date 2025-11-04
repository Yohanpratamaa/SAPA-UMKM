import React from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { SampleDataManager } from "../components/SampleDataManager";

function SampleDataScreen() {
  return <SampleDataManager />;
}

export default function ProtectedSampleDataScreen() {
  return (
    <ProtectedRoute>
      <SampleDataScreen />
    </ProtectedRoute>
  );
}
